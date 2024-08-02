import { CoverComposeType, UpsEntityCV as UpsEntityType } from '@lib/data';
import { Flow, MessagingService, UtilService } from '@lib/modules';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { SagaBuilder } from 'yoonite-saga';
import { CameraEvent } from '../../../camera-events/entities/camera-event';
import { ControlSession } from '../../../control-sessions/entities/controlSession.entity';
import { ParkingRight } from '../../types/parking-right';
import { WithUPS } from '../session-exit/session-exit.service';
export class SessionEntryDto {
  lpn!: string;
  upsId!: string;
  happenedAt!: string;
  eventId!: string;
}

type WithSubscriptionCorage = { subscriptionsCoverage: [CoverComposeType] };

type WithSession = {
  session: ControlSession;
};

type WithParkingRights = {
  parkingRights: ParkingRight[];
};

type WithSubscriptions = {
  subscriptions: ParkingRight[];
};

@Injectable()
export class SessionEntryService extends Flow {
  constructor(
    private messagingService: MessagingService,
    private utilService: UtilService,
  ) {
    super();
  }

  build<Context>(initialContext: Context) {
    const builder = new SagaBuilder({ debug: true });

    return builder
      .step('Inject initial context')
      .invoke(() => initialContext)
      .validate(SessionEntryDto)

      .step('fetch linked ups')
      .invoke(async ({ upsId }: SessionEntryDto) => {
        // app: 'MS_CLIENT',
        // pattern: 'ups:read',
        // payload:    { upsId },
        const { ups } = await this.messagingService.send<any>({
          app: 'MS_CLIENT',
          pattern: 'ups:read',
          payload: {
            upsId,
          },
          cache: {
            cache: true,
            cacheTtl: 6 * 60 * 60,
          },
        });

        return { ups };
      })

      .step('Fetch all the subscription for the lpn')
      .invoke(
        async ({
          lpn,
          happenedAt,
          ups,
        }: SessionEntryDto & {
          ups: UpsEntityType;
        }) => {
          const subscriptions: ParkingRight[] =
            await this.messagingService.send({
              app: 'API_LEGACY',
              pattern: 'subscriptions:search',
              payload: {
                upsId: ups._id,
                lpn,
              },
              cache: {
                cache: true,
                cacheTtl: 1000 * 20,
              },
            });

          const subscriptionsCoverage = subscriptions.map(
            ({ tariffType, startDate, endDate }) => ({
              coverType: tariffType,
              startDate,
              endDate,
            }),
          );

          return { subscriptions, subscriptionsCoverage };
        },
      )

      .step('Close old opened sessions for this vehicle')
      .invoke(
        async ({
          lpn,
          ups,
        }: SessionEntryDto & WithSubscriptionCorage & WithUPS) => {
          // Update all sessions into this UPS without exit event
          await this.messagingService.send({
            app: 'MS_CONTROL',
            pattern: 'sessions:handle-old-sessions',
            payload: {
              lpn,
              upsId: ups._id,
            },
          });
        },
      )

      .step('Create the session')
      .invoke(
        async ({
          lpn,
          happenedAt,
          eventId,
          subscriptionsCoverage,
          ups,
        }: SessionEntryDto & WithSubscriptionCorage & WithUPS) => {
          const { config } = ups as any;
          const { prestoScan } = config;
          const { entryTolerancePeriod } = prestoScan;

          const { session } = await this.messagingService.send<any>({
            app: 'MS_CONTROL',
            pattern: 'sessions:create',
            payload: {
              lpn,
              upsId: ups._id,
              entryEventId: eventId,
              startDate: DateTime.fromISO(happenedAt),
              channels: [{ channel: 'ups', _id: ups._id }],
              covers: this.utilService.removeDuplicatesS([
                {
                  coverType: 'TOLERANCE_PERIOD',
                  startDate: DateTime.fromISO(happenedAt),
                  endDate: DateTime.fromISO(happenedAt).plus({
                    minutes: entryTolerancePeriod,
                  }),
                },
                ...subscriptionsCoverage,
              ]),
            },
          });

          return { session };
        },
      )

      .step('Update the parking occupancy')
      .invoke(async ({ upsId, eventId }: SessionEntryDto & WithSession) => {
        const { cameraEvent }: { cameraEvent: CameraEvent } =
          await this.messagingService.send({
            app: 'MS_CONTROL',
            pattern: 'camera-events:read',
            payload: {
              cameraEventId: eventId,
            },
          });

        if (cameraEvent.isVehicle) {
          await this.messagingService.send({
            app: 'MS_CLIENT',
            pattern: 'ups:update-occupancy',
            payload: {
              upsId,
              delta: 1,
            },
          });
        }
      })

      .step('Fetch all the parking rights for the lpn')
      .invoke(async ({ session, ups }: WithSession & WithUPS) => {
        const parkingRights = await this.messagingService.send<ParkingRight[]>({
          app: 'API_LEGACY',
          pattern: 'parking-rights:search',
          payload: {
            upsId: ups._id,
            lpn: session.lpn,
            startDate: {
              $gte: DateTime.now().minus({ days: 7 }).toISODate(),
            },
            endDate: {
              $gte: DateTime.now().plus({ minutes: 1 }).toISODate(),
            },
          },
        });

        return { parkingRights };
      })

      .step('Update event with subscription')
      .condition(
        ({ subscriptionsCoverage, parkingRights }: any) =>
          subscriptionsCoverage.length > 0 || parkingRights.length > 0,
      )
      .invoke(
        async ({
          eventId,
          parkingRights,
          subscriptions,
        }: SessionEntryDto & WithParkingRights & WithSubscriptions) => {
          const { cameraEvent } = await this.messagingService.send<any>({
            app: 'MS_CONTROL',
            pattern: 'camera-events:update',
            payload: {
              cameraEventId: eventId,
              hasSubscription: subscriptions.length > 0,
              hasParkingRight: parkingRights.length > 0,
            },
          });
          return { cameraEvent };
        },
      )

      .build();
  }
}
