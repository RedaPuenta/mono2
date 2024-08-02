import {
  PrestoScanConfigDeletionDelayComposeType,
  UpsEntityType,
} from '@lib/data';
import {
  Flow,
  HashingService,
  MessagingService,
  UtilService,
} from '@lib/modules';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { SagaBuilder } from 'yoonite-saga';
import { Workflow } from 'yoonite-saga/dist/types/workflow.type';
import { ControlSession } from '../../../control-sessions/entities/controlSession.entity';

const controlStateToAnonimizationDelayMap = new Map([
  ['UNDEFINED', 'incomplete'],
  ['TO_CONTROL', 'toCheck'],
  ['OK', 'complete'],
  ['NOT_FINED', 'unfined'],
  ['FINED', 'fined'],
]);

type WithUPSConfigMap = {
  upsConfigMap: {
    id: string;
    deletionDelay: PrestoScanConfigDeletionDelayComposeType;
  }[];
};

type WithSessionsForAnon = {
  sessionsForAnon: ControlSession[];
};

type WithResourceIds = { bucketResourceIds: string[] };

@Injectable()
export class AnonymizationService extends Flow {
  constructor(
    private messagingService: MessagingService,
    private hashingService: HashingService,
    private utilService: UtilService,
  ) {
    super();
  }

  build<Context>(initialContext: Context): Workflow {
    const builder = new SagaBuilder();

    return builder
      .step('Inject initial context')
      .invoke((ctx: any) => ({ ...ctx, ...initialContext }))

      .step('Fetch all the pairs (ups - anonymization params)')
      .invoke(async () => {
        console.log(
          '\t1/ Fetching all the pairs (ups - anonymization params) ...',
        );

        const prestoScanUpses =
          await this.utilService.paginatedProcessor<UpsEntityType>(
            (page: any, limit: any) =>
              this.messagingService.send<any>({
                app: 'MS_CLIENT',
                pattern: 'ups:search',
                payload: {
                  page,
                  limit,
                  isPrestoscan: true,
                },
              }),
          );

        const upsConfigMap = await Promise.all(
          prestoScanUpses.map(async ({ _id }: any) => {
            const { computedConfig } = await this.messagingService.send<any>({
              app: 'MS_CLIENT',
              pattern: 'ups:config',
              payload: {
                upsId: _id,
              },
            });

            return {
              id: _id,
              deletionDelay: computedConfig?.prestoScan?.deletionDelay,
            };
          }),
        );

        return { upsConfigMap };
      })

      .step('Fetch sessions that can be anonymized')
      .invoke(async ({ upsConfigMap }: WithUPSConfigMap) => {
        console.log('\t2/ Fetching sessions that can be anonymized ...');

        const sessionsForAnon = (
          await Promise.all(
            // For each UPS, check delays
            upsConfigMap.flatMap((ups: any) =>
              ['UNDEFINED', 'TO_CONTROL', 'OK', 'NOT_FINED', 'FINED'].flatMap(
                async (controlState) => {
                  const delayProperty =
                    controlStateToAnonimizationDelayMap.get(controlState);

                  const xDaysAgo = DateTime.now()
                    .minus({ days: ups.deletionDelay[delayProperty as any] })
                    .toISO();

                  const sessions: Promise<ControlSession[]> =
                    this.utilService.paginatedProcessor(
                      (page: any, limit: any) =>
                        this.messagingService.send<any>({
                          app: 'MS_CONTROL',
                          pattern: 'sessions:search',
                          payload: {
                            page,
                            limit,
                            upsId: ups.id,
                            isExposed: true,
                            controlState,
                            updatedAt: { $lt: xDaysAgo },
                          },
                        }),
                    );

                  return sessions;
                },
              ),
            ),
          )
        )
          // Flat all sessions array
          .flat()
          // Remove duplicates
          .reduce((acc: any, session: any) => {
            const x = acc.find((item: any) => item._id === session._id);
            return x ? acc : acc.concat([session]);
          }, []);

        console.log(`${sessionsForAnon.length} sessions can be anonymized`);
        return { sessionsForAnon };
      })

      .step('Anonymize the camera events')
      .condition(
        ({ sessionsForAnon }: WithSessionsForAnon) =>
          sessionsForAnon.length > 0,
      )
      .invoke(async ({ sessionsForAnon }: WithSessionsForAnon) => {
        console.log('\t3/ Anonymizing the camera events ...');

        // TODO: utiliser un cascade quand on aura plusieurs UPS
        const resources = await Promise.all(
          sessionsForAnon.flatMap(
            async (session) =>
              await this.messagingService.send<any>({
                app: 'MS_CONTROL',
                pattern: 'camera-events:anonymize',
                payload: {
                  ids: [session.entryEventId, session.exitEventId].filter(
                    (s) => !!s,
                  ),
                },
              }),
          ),
        );
        return { bucketResourceIds: [...new Set(resources.flat())] };
      })

      .step('Delete the resources from the bucket')
      .condition(
        ({ sessionsForAnon }: WithSessionsForAnon) =>
          sessionsForAnon.length > 0,
      )
      .invoke(async ({ bucketResourceIds }: WithResourceIds) => {
        console.log('\t4/ Deleting the resources from the bucket ...');
        await this.messagingService.send({
          app: 'BFF_RESOURCES',
          pattern: 'deleteMany',
          payload: {
            bucket: 'presto-scan',
            ids: bucketResourceIds,
          },
        });
      })

      .step('Update the sessions')
      .condition(
        ({ sessionsForAnon }: WithSessionsForAnon) =>
          sessionsForAnon.length > 0,
      )
      .invoke(async ({ sessionsForAnon }: WithSessionsForAnon) => {
        console.log('\t5/ Updating the sessions ...');

        await Promise.all(
          sessionsForAnon.map(async (session) => {
            const lpnHash = await this.hashingService.hash({
              algorithm: 'md5',
              digest: 'hex',
              payload: session.lpn,
              length: 12,
            });

            await this.messagingService.send({
              app: 'MS_CONTROL',
              pattern: 'sessions:update',
              payload: {
                id: session._id,
                update: {
                  isExposed: false,
                  lpn: lpnHash,
                  controlCtx: {
                    claims: [],
                    ctxRelevantCovers: [],
                  },
                } as Partial<ControlSession>,
              },
            });
          }),
        );
      })
      .withCompensation(async () => {
        await this.messagingService.send({
          app: 'API_TOOLS',
          pattern: 'hermes:send',
          payload: {
            tool: 'discord',
            msg: `The nightly anonymization workflow failed at ${DateTime.now().toISO()}`,
            channelName: 'warnings',
          },
        });
      })

      .build();
  }
}
