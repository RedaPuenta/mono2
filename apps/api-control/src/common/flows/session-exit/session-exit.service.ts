import {
  CoverComposeType,
  HealthSummaryComposeType,
  UpsEntityCV as UpsEntityType,
} from '@lib/data';
import { Flow, MessagingService, UtilService } from '@lib/modules';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { SagaBuilder } from 'yoonite-saga';
import { CameraEvent } from '../../../camera-events/entities/camera-event';
import { ControlSession } from '../../../control-sessions/entities/controlSession.entity';
import { ParkingRight } from '../../types/parking-right';
import { MS } from '../../types/tims';

type ExitEventDto = {
  eventId: string;
  lpn: string;
  upsId: string;
  happenedAt: string;
};

type WithSession = {
  session: ControlSession;
};

type WithUncoveredDuration = {
  uncoveredDuration: number;
};

type WithHealthSummary = {
  healthSummary: HealthSummaryComposeType;
};

type WithCoverage = {
  rightsCoverage: [CoverComposeType];
  subscriptionsCoverage: [CoverComposeType];
  freetimeCoverage: [CoverComposeType];
};

type WithComputedCoverage = {
  coverage: [CoverComposeType];
  freetimeCoverage: [CoverComposeType];
  rightsDuration: number;
};

export type WithUPS = { ups: UpsEntityType };

function differenceInMinutes(date1: Date, date2: Date): number {
  const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  return diffInMilliseconds / (1000 * 60);
}

const cropCoverage = (
  coverage: CoverComposeType[],
  start: string,
  end: string,
): CoverComposeType[] => {
  const startDT = DateTime.fromISO(start);
  const endDT = DateTime.fromISO(end);

  const croppedCoverage = coverage.map(({ startDate, endDate, coverType }) => ({
    coverType,
    startDate: DateTime.fromISO(startDate) < startDT ? start : startDate,
    endDate: DateTime.fromISO(endDate) > endDT ? end : endDate,
  }));

  return croppedCoverage;
};

@Injectable()
export class SessionExitService extends Flow  {
  constructor(
    private messagingService: MessagingService,
    private utilService: UtilService,
  ) {
    super();
  }



  /**
   * Computes the unpaid time between the enterDate and exitDate based on the coverage periods.
   * @param enterDate The date when the session started.
   * @param exitDate The date when the session ended.
   * @param coverage The list of coverage periods.
   * @returns The unpaid time in minutes.
   */
  private computeCoverage(
    enterDate: string,
    exitDate: string,
    periods: CoverComposeType[],
  ): number {
    const coverage = this.utilService.deepCopy(periods);

    const start = new Date(enterDate);
    const end = new Date(exitDate);
    const duration = differenceInMinutes(start, end);

    if (coverage.length === 0) {
      return duration;
    }

    // Sort periods by start date
    const sortedPeriods = coverage.sort(
      (a: any, b: any) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Merge overlapping periods
    const mergedPeriods: CoverComposeType[] = [];
    sortedPeriods.forEach((period: any) => {
      if (
        !mergedPeriods.length ||
        new Date(mergedPeriods[mergedPeriods.length - 1].endDate).getTime() <
          new Date(period.startDate).getTime()
      ) {
        mergedPeriods.push(period);
      } else {
        mergedPeriods[mergedPeriods.length - 1].endDate = new Date(
          Math.max(
            new Date(mergedPeriods[mergedPeriods.length - 1].endDate).getTime(),
            new Date(period.endDate).getTime(),
          ),
        ).toISOString();
      }
    });

    // Compute total duration
    const rightsCoverage = mergedPeriods.reduce((total, period) => {
      const duration =
        (new Date(period.endDate).getTime() -
          new Date(period.startDate).getTime()) /
        (1000 * 60);
      return total + duration;
    }, 0);

    if (rightsCoverage >= duration) return 0;
    else return Math.ceil(duration - rightsCoverage);
  }

  build<Context>(initialContext: Context) {
    const builder = new SagaBuilder();

    return builder
      .step('Inject initial context')
      .invoke(() => initialContext)

      .step('Fetch linked ups')
      .invoke(async ({ upsId, lpn }: ExitEventDto) => {
        const { ups } = await this.messagingService.send<any>({
          app: 'MS_CLIENT',
          pattern: 'ups:read',
          payload: {
            upsId,
          },
          // ups ids are super slow changers so cache for 6h
          cache: { cache: true, cacheTtl: 6 * MS.hour },
        });
        return { ups };
      })

      .step('Fetch the ongoing session')
      .invoke(async ({ lpn, upsId, ups }: ExitEventDto & WithUPS) => {
        const { list } = await this.messagingService.send<any>({
          app: 'MS_CONTROL',
          pattern: 'sessions:search',
          payload: {
            lpn,
            exitEventId: {
              $exists: false,
            },
            upsId: ups._id,
            order: '-createdAt',
            limit: 1,
          },
        });

        if (list.length === 0)
          throw new Error(`No session found for lpn ${lpn} and ups ${upsId}`);

        return { session: list[0] };
      })

      .step('Fetch the health summary for ups')
      .invoke(async ({ ups }: ExitEventDto & WithUPS) => {
        const { list } = await this.messagingService.send<any>({
          app: 'MS_LEGACY',
          pattern: 'health:search',
          payload: {
            upsId: ups._id,
          },
        });
        return { healthSummary: list[0] };
      })

      .step('Fetch all the parking rights for the lpn')
      .invoke(
        async ({ lpn, session, ups }: ExitEventDto & WithSession & WithUPS) => {
          const parkingRights = await this.messagingService.send<any>({
            app: 'API_LEGACY',
            pattern: 'parking-rights:search',
            payload: {
              upsId: ups._id,
              lpn,
              startDate: session.startDate,
            },
          });

          const rightsCoverage = this.utilService
            .removeDuplicatesS(
              parkingRights.filter(
                (ticket: ParkingRight) =>
                  DateTime.fromISO(ticket.endDate) >
                  DateTime.fromISO(session.startDate),
              ),
            )
            .map(({ tariffType, startDate, endDate }: any) => ({
              coverType: tariffType,
              startDate,
              endDate,
            }));

          return { parkingRights, rightsCoverage };
        },
      )

      .step('Fetch all the subscription for the lpn')
      .invoke(
        async ({
          lpn,
          happenedAt,
          session,
          ups,
        }: ExitEventDto & WithSession & WithUPS) => {
          const subscriptions = this.utilService
            .removeDuplicatesS(
              await this.messagingService.send<CoverComposeType[]>({
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
              }),
            )
            .filter(
              (sub: CoverComposeType) =>
                DateTime.fromISO(sub.endDate) >
                DateTime.fromISO(session.startDate),
            );

          const subscriptionsCoverage = subscriptions.map(
            ({ tariffType, startDate, endDate }: any) => ({
              coverType: tariffType,
              startDate,
              endDate,
            }),
          );
          return { subscriptions, subscriptionsCoverage };
        },
      )
      .step('fetch free time for session period and build freetime coverage')
      .invoke(
        async ({
          session,
          happenedAt,
          ups,
        }: ExitEventDto & WithSession & WithUPS) => {
          const freeTimes = await this.messagingService.send<any>({
            app: 'API_LEGACY',
            pattern: 'parking-rights:freetime',
            payload: {
              upsId: ups._id,
              startDate: session.startDate,
              endDate: happenedAt,
            },
            cache: {
              cache: true,
              cacheTtl: 1 * 60 * 60,
            },
          });

          const freetimeCoverage = freeTimes.map(
            ({ startISODate, stopISODate }: any) => ({
              coverType: 'FREE_PERIOD',
              startDate: DateTime.fromISO(startISODate),
              endDate: DateTime.fromISO(stopISODate),
            }),
          );

          return { freetimeCoverage };
        },
      )

      .step('build coverage')
      .invoke(
        async ({
          rightsCoverage,
          subscriptionsCoverage,
          freetimeCoverage,
          session,
          happenedAt,
          ups,
        }: ExitEventDto & WithSession & WithCoverage & WithUPS) => {
          const prestoScan = ups?.config?.prestoscan as any;

          const filteredSessionCoverage = (session.covers || []).filter(
            ({ coverType }) =>
              coverType !== 'SUBSCRIPTION' && coverType !== 'FREE_PERIOD',
          );

          const exitFreePeriodStart = DateTime.fromISO(happenedAt).minus({
            minutes: prestoScan.exitTolerancePeriod,
          });

          let freeExitPeriod: CoverComposeType[] = [];

          if (exitFreePeriodStart > DateTime.fromISO(session.startDate)) {
            freeExitPeriod = [
              {
                coverType: 'TOLERANCE_PERIOD' as any,
                startDate: DateTime.fromISO(happenedAt)
                  .minus({
                    minutes: prestoScan.exitTolerancePeriod,
                  })
                  .toISO()!,
                endDate: DateTime.fromISO(happenedAt).toISO()!,
              },
            ];
          }

          const coverage = this.utilService.removeDuplicatesS(
            cropCoverage(
              [
                ...rightsCoverage,
                ...filteredSessionCoverage,
                ...freetimeCoverage,
                ...subscriptionsCoverage,
                ...freeExitPeriod,
              ],
              session.startDate,
              happenedAt,
            ),
          );

          const uncoveredDuration = this.computeCoverage(
            session.startDate,
            happenedAt,
            coverage,
          );

          const { startDate, endDate } = session;
          const rightsDuration =
            DateTime.fromISO(happenedAt)
              .diff(DateTime.fromISO(startDate))
              .as('minutes') - uncoveredDuration;

          return { coverage, uncoveredDuration, rightsDuration };
        },
      )
      .step('update session')
      .invoke(
        async ({
          eventId,
          happenedAt,
          session,
          coverage,
          healthSummary,
          uncoveredDuration,
          rightsDuration,
        }: ExitEventDto &
          WithSession &
          WithHealthSummary &
          WithComputedCoverage &
          WithUncoveredDuration) => {
          const { session: updatedSession } =
            await this.messagingService.send<any>({
              app: 'MS_CONTROL',
              pattern: 'sessions:update',
              payload: {
                id: session._id,
                update: {
                  controlState: uncoveredDuration > 0 ? 'TO_CONTROL' : 'OK',
                  exitEventId: eventId,
                  covers: coverage,
                  healthSummary,
                  uncoveredDuration,
                  rightsDuration,
                  endDate: DateTime.fromISO(happenedAt).toISO(),
                },
              },
            });

          return { session: updatedSession };
        },
      )

      .step('update camera event')
      .invoke(async ({ session }: WithSession) => {
        const { exitEventId, entryEventId, covers = [] } = session;

        await this.messagingService.send({
          app: 'MS_CONTROL',
          pattern: 'camera-events:update',
          payload: {
            cameraEventId: entryEventId,
            hasParkingRight: !!(covers || []).find(
              ({ coverType }) => coverType === 'SHORT_TERM',
            ),
            hasSubscription: !!(covers || []).find(
              ({ coverType }) => coverType === 'SUBSCRIPTION',
            ),
          },
        });

        await this.messagingService.send({
          app: 'MS_CONTROL',
          pattern: 'camera-events:update',
          payload: {
            cameraEventId: exitEventId,
            hasParkingRight: !!(covers || []).find(
              ({ coverType }) => coverType === 'SHORT_TERM',
            ),
            hasSubscription: !!(covers || []).find(
              ({ coverType }) => coverType === 'SUBSCRIPTION',
            ),
          },
        });
      })

      .step('Update the parking occupancy')
      .condition(({ session }: any) => !!session)
      .invoke(async ({ upsId, session }: ExitEventDto & WithSession) => {
        const { cameraEvent }: { cameraEvent: CameraEvent } =
          await this.messagingService.send({
            app: 'MS_CONTROL',
            pattern: 'camera-events:read',
            payload: {
              cameraEventId: session.entryEventId,
            },
          });

        if (cameraEvent.isVehicle) {
          await this.messagingService.send({
            app: 'MS_CLIENT',
            pattern: 'ups:update-occupancy',
            payload: {
              upsId,
              delta: -1,
            },
          });
        }
      })

      .build();
  }
}
