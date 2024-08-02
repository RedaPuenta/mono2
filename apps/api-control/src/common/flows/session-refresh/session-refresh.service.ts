import {
  CoverComposeType,
  FpsEntityType,
  P1000ParkingRightComposeType,
  UpsEntityType,
} from '@lib/data';
import { Flow, MessagingService, UtilService } from '@lib/modules';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import { SagaBuilder } from 'yoonite-saga';
import { ControlSession } from '../../../control-sessions/entities/controlSession.entity';
import { P1000Service } from '../../../p1000/p1000.service';
import { ParkingRight, ParkingRightMin } from '../../types/parking-right';

type WithOngoingSessions = {
  ongoingSessions: ControlSession[];
};

type WithUpdatedSessions = {
  updatedSessions: ControlSession[];
};

function mapParkingRight2Cover({
  tariffType,
  startDate,
  endDate,
}: ParkingRight): CoverComposeType {
  const fixNeeded = DateTime.fromISO(startDate) > DateTime.fromISO(endDate);

  return {
    coverType: tariffType as any,
    startDate: fixNeeded ? endDate : startDate,
    endDate: fixNeeded ? startDate : endDate,
  };
}

function minifyParkingRight(
  {
    tariffType,
    usedMeansOfPayment,
    urbanParkingSiteId,
    startDate,
    endDate,
  }: ParkingRight,
  upsId: string,
): ParkingRightMin {
  return {
    tariffType,
    usedMeansOfPayment,
    legacyId: !!urbanParkingSiteId ? urbanParkingSiteId : [''],
    startDate,
    endDate,
    upsId,
  };
}

function fps2Cover(
  { statementDatetime, validityDatetime, type, zoneId }: FpsEntityType,
  upsId: string,
): ParkingRightMin {
  return {
    tariffType: 'FINE',
    usedMeansOfPayment: 'FPS',
    legacyId: [zoneId],
    startDate: statementDatetime,
    endDate: validityDatetime as any,
    upsId,
    status: type,
  };
}

function isRelevantToSession(
  ticket: ParkingRight,
  { startDate, endDate }: ControlSession,
) {
  // If session is closed
  if (endDate) {
    return (
      DateTime.fromISO(startDate) <= DateTime.fromISO(ticket.endDate) &&
      DateTime.fromISO(endDate) >= DateTime.fromISO(ticket.startDate)
    );
  }

  // If session is opened
  return DateTime.fromISO(startDate) <= DateTime.fromISO(ticket.endDate);
}

@Injectable()
export class SessionRefreshService extends Flow {
  constructor(
    private messagingService: MessagingService,
    private p1000Service: P1000Service,
    private utilService: UtilService,
  ) {
    super();
  }

  ticketsMatch = (period: CoverComposeType, ticket: ParkingRight) =>
    period.startDate === ticket.startDate &&
    period.endDate === ticket.endDate &&
    period.coverType === ticket.tariffType;

  ticketAlreadyExists = (ticket: ParkingRight, tickets: CoverComposeType[]) =>
    tickets.some((period: any) => this.ticketsMatch(period, ticket));

  async fetchSameClientUPSs(
    upsId: string,
  ): Promise<
    (UpsEntityType & { cityId: string; legacyId: string })[] | undefined
  > {
    try {
      const { ups }: { ups: UpsEntityType } =
        await this.messagingService.send<any>({
          app: 'MS_CLIENT',
          pattern: 'ups:read',
          payload: { _id: upsId },
          cache: { cache: true, cacheTtl: 60 * 60 * 1000 },
        });

      const upses = await this.utilService.paginatedProcessor<UpsEntityType>(
        async (page: any, limit: any) =>
          await this.messagingService.send({
            app: 'MS_CLIENT',
            pattern: 'ups:search',
            payload: {
              clientId: ups.clientId,
              limit,
              page,
            },
            cache: {
              cache: true,
              cacheTtl: 60 * 60 * 1000,
            },
          }),
      );

      const result = await Promise.all(
        upses.map(async ({ _id: upsId }: any) => {
          const { ups, computedConfig, client } =
            await this.messagingService.send<any>({
              app: 'MS_CLIENT',
              pattern: 'ups:config',
              payload: {
                upsId,
              },
              cache: {
                cache: true,
                cacheTtl: 60 * 60 * 1000,
              },
            });

          return {
            ...ups,
            legacyId: computedConfig.p1000.legacyId,
            cityId: client.slug,
          };
        }),
      );

      return result;
    } catch (error) {
      console.error('Error while fetching same client upses', error);
    }
  }

  build<Context>(initialContext: Context) {
    return new SagaBuilder({ debug: true })

      .step('Inject initial context')
      .invoke(() => initialContext)

      .step('fetch ongoing sessions')
      .invoke(async () => {
        const notSoLongAgo = DateTime.now().minus({ day: 7 }).toISO();

        const ongoingSessions =
          await this.utilService.paginatedProcessor<ControlSession>(
            async (page: any, limit: any) =>
              await this.messagingService.send({
                app: 'MS_CONTROL',
                pattern: 'sessions:search',
                payload: {
                  exitEventId: { $exists: false },
                  controlState: 'UNDEFINED',
                  startDate: {
                    $gt: notSoLongAgo,
                  },
                  page,
                  limit,
                },
              }),
          );

        return { ongoingSessions };
      })

      .step('fetch new tickets for ongoing sessions')
      .condition(
        ({ ongoingSessions }: WithOngoingSessions) =>
          ongoingSessions.length > 0,
      )
      .invoke(async ({ ongoingSessions }: WithOngoingSessions) => {
        const ongoingSessionsIndex = new Map(
          ongoingSessions.map((session) => [
            session.lpn?.toUpperCase().replace(/-/g, ''),
            session,
          ]),
        );

        const sessions = await Promise.all(
          this.utilService
            .groupBy(ongoingSessions, 'upsId')
            .map(async ([upsId, ongoingSessions]: any) => {
              const upses = (await this.fetchSameClientUPSs(upsId)) ?? [];

              const startResearchDate = DateTime.fromISO(
                this.utilService.minBy(
                  ongoingSessions,
                  (s1: any, s2: any) =>
                    DateTime.fromISO(s1.startDate).diff(
                      DateTime.fromISO(s2.startDate),
                    ).milliseconds,
                ).startDate,
              )
                .minus({ minute: 15 })
                .toISO();

              const lpnSearch = ongoingSessions.map(
                (session: any) => session.lpn,
              );

              const legacyId2YooniteIdMap: any = new Map(
                upses
                  .filter(({ legacyId }) => !!legacyId)
                  .map(({ _id, legacyId }) => [legacyId, _id]),
              );

              const legacyId2CityMap = new Map(
                upses
                  .filter(({ legacyId }) => !!legacyId)
                  .map(({ legacyId, cityId }) => [legacyId, cityId]),
              );

              // fetch p1000 config for each ups
              const ups2ConfigMap = await Promise.all(
                upses.map(async (ups: any) => ({
                  ups,
                  p1000Config: (await this.p1000Service.fetchClientConfig(
                    ups._id,
                  ))!.computedConfig.p1000,
                })),
              );

              // compute target urls for each ups so we can groups calls to each p1000
              const ups2TargetURLMap = this.utilService.groupBy(
                ups2ConfigMap.map(({ ups, p1000Config }) => ({
                  ups,
                  targetURL: this.p1000Service.getP1000URL(
                    'prestoplatform/show_parking_right',
                    p1000Config!,
                  ),
                })),
                'targetURL',
              );

              const newTickets: ParkingRight[] = (
                await this.utilService.cascade<any>(
                  ups2TargetURLMap.map(([targetURL]: any) => async () => {
                    const test = await this.p1000Service.queryP10002(
                      targetURL,
                      {
                        vehicleRegistrationPlateIdentifier: lpnSearch,
                        tariffType: ['SHORT_TERM', 'OFFSTREET'],
                        startDateGreaterOrEqualsThan: startResearchDate,
                      },
                      (response: any) => response?.data?.data ?? [],
                    );

                    return test;
                  }),
                )
              ).flat();

              const updatedSessions = this.utilService
                .groupBy(newTickets, 'urbanParkingSiteId')
                .flatMap(([urbanParkingSiteId, tickets]) => {
                  return this.utilService
                    .groupBy(tickets, 'vehicleRegistrationPlateIdentifier')
                    .flatMap(([lpn, tickets]: any) => {
                      const ongoingSession = ongoingSessionsIndex.get(lpn);

                      if (!ongoingSession || !urbanParkingSiteId) {
                        return {};
                      }

                      const relevantTickets = tickets
                        .filter((ticket: any) =>
                          isRelevantToSession(ticket, ongoingSession),
                        )
                        // We only keep the tickets on the session ups for covers
                        .filter((ticket: any) =>
                          this.utilService.arraysIntersect(
                            ticket.urbanParkingSiteId,
                            urbanParkingSiteId,
                          ),
                        );

                      const hentaiRelevantTickets = relevantTickets.map(
                        ({
                          startDate,
                          endDate,
                          chargePaid,
                          id,
                          pointOfSaleId,
                        }: ParkingRight) =>
                          ({
                            startDatetime: startDate,
                            endDatetime: endDate,
                            parkId: '',
                            rightPrice: chargePaid * 100,
                            parkingRightId: id,
                            pointOfSaleId,
                            type: 'TICKET',
                            cityId: legacyId2CityMap.get(urbanParkingSiteId),
                            zoneId: urbanParkingSiteId,
                          } as Pick<
                            P1000ParkingRightComposeType,
                            | 'startDatetime'
                            | 'endDatetime'
                            | 'parkId'
                            | 'rightPrice'
                            | 'pointOfSaleId'
                            | 'type'
                            | 'cityId'
                            | 'zoneId'
                          > & { parkingRightId: string }),
                      );

                      const updatedCovers = [
                        ...(ongoingSession.covers || []),
                        ...relevantTickets.map(mapParkingRight2Cover),
                      ];

                      const updatedControlCtx = {
                        ...(ongoingSession.controlCtx || []),
                        ctxRelevantCovers: this.utilService.removeDuplicatesS([
                          ...((Array.isArray(
                            ongoingSession.controlCtx?.ctxRelevantCovers,
                          )
                            ? ongoingSession.controlCtx?.ctxRelevantCovers
                            : []) as any),
                          ...tickets
                            // For the context relevant tickets we keep the tickets for other upses
                            .filter(
                              (ticket: any) =>
                                !this.utilService.arraysIntersect(
                                  ticket.urbanParkingSiteId,
                                  urbanParkingSiteId,
                                ),
                            )
                            .map((ticket: any) =>
                              minifyParkingRight(
                                ticket,
                                legacyId2YooniteIdMap.get(urbanParkingSiteId),
                              ),
                            ),
                        ]),
                      };

                      return {
                        ...ongoingSession,
                        covers: this.utilService.removeDuplicatesS([
                          ...(ongoingSession.covers as any),
                          ...updatedCovers,
                        ]),
                        controlCtx:
                          !ongoingSession.controlCtx ||
                          updatedControlCtx.ctxRelevantCovers.length >
                            (ongoingSession.controlCtx.ctxRelevantCovers as any)
                              .length
                            ? updatedControlCtx
                            : ongoingSession.controlCtx,
                        significantRights: this.utilService.removeDuplicatesS([
                          ...(ongoingSession.significantRights as any),
                          ...hentaiRelevantTickets,
                        ]),
                      } as ControlSession;
                    });
                });

              return updatedSessions;
            }),
        );

        return { updatedSessions: sessions.flat() };
      })

      .step('update covers')
      .condition(
        ({ updatedSessions }: WithUpdatedSessions) =>
          updatedSessions && updatedSessions.length > 0,
      )
      .invoke(async ({ updatedSessions }: WithUpdatedSessions) => {
        console.log(
          `${updatedSessions.length} sessions to update with new covers`,
        );

        await this.utilService.cascade<any>(
          updatedSessions
            .filter((session) => !!session && !!session._id)
            .map((session) => async () => {
              console.log(
                '🚀 ~ SessionRefreshWorkflow ~ .map ~ session:',
                session,
              );

              const { _id, covers, controlCtx, significantRights } = session;

              const { session: updatedSession } =
                await this.messagingService.send<any>({
                  app: 'MS_CONTROL',
                  pattern: 'sessions:update',
                  payload: {
                    id: _id,
                    update: {
                      controlCtx,
                      covers,
                      significantRights,
                    } as Partial<ControlSession>,
                  },
                });
              return updatedSession;
            }),
        );
      })

      .step('fetch claims for session contexts')
      .condition(
        ({
          ongoingSessions,
          updatedSessions,
        }: WithOngoingSessions & WithUpdatedSessions) =>
          (ongoingSessions && ongoingSessions?.length > 0) ||
          (updatedSessions && updatedSessions?.length > 0),
      )
      .invoke(
        async ({
          updatedSessions,
          ongoingSessions,
        }: WithOngoingSessions & WithUpdatedSessions) => {
          const sessions =
            !!updatedSessions &&
            updatedSessions.filter((session) => !!session).length > 0
              ? updatedSessions
              : ongoingSessions;

          const sessionsWithFps = await this.utilService.cascade<any>(
            sessions
              .filter((session) => !!session && !!session.lpn)
              .map((session) => async () => {
                const plate = session.lpn.replace(/-/g, '');
                const fpses: FpsEntityType[] = await this.p1000Service.queryApi(
                  'fines-search',
                  {
                    // TODO: rajouter le paramètre cityId pour que le token
                    // Prestoplatform fonctionne (voir avec ASO)
                    licensePlate: { plate },
                  },
                  (response: any) => response?.data?.matches ?? [],
                );

                return {
                  session,
                  fpses,
                };
              }),
          );

          const updated = sessionsWithFps
            .filter(({ fpss }: any) => fpss && fpss.length > 0)
            .map(({ session, fpss }: any) => ({
              ...session,
              controlCtx: {
                ...session.controlCtx,
                claims: this.utilService.removeDuplicatesS([
                  ...(session.controlCtx?.claims || []),
                  ...fpss.flatMap((fps: any) => fps.claims),
                ]),
                ctxRelevantCovers: [
                  ...(session.controlCtx?.ctxRelevantCovers || []),
                  ...fpss
                    .filter(
                      (ticket: any) =>
                        !this.ticketAlreadyExists(
                          ticket,
                          session.controlCtx?.ctxRelevantCovers || [],
                        ),
                    )
                    .map((fps: any) => fps2Cover(fps, session.upsId)),
                ],
              },
            }));

          return { updatedSessions: updated };
        },
      )

      .step('update control ctx')
      .condition(
        ({ updatedSessions }: WithUpdatedSessions) =>
          updatedSessions && updatedSessions.length > 0,
      )
      .invoke(async ({ updatedSessions }: WithUpdatedSessions) => {
        await this.utilService.cascade<any>(
          updatedSessions
            .filter((session) => !!session && !!session._id)
            .map((session) => async () => {
              const { _id, controlCtx } = session;
              const { session: updatedSession } =
                await this.messagingService.send<any>({
                  app: 'MS_CONTROL',
                  pattern: 'sessions:update',
                  payload: {
                    id: _id,
                    update: {
                      controlCtx: controlCtx,
                    } as Partial<ControlSession>,
                  },
                });
              return updatedSession;
            }),
        );
      })

      .step('update cameras events')
      .condition(
        ({ updatedSessions }: WithUpdatedSessions) =>
          updatedSessions?.length > 0,
      )
      .invoke(async ({ updatedSessions }) => {
        await Promise.all(
          updatedSessions.map(async ({ covers, entryEventId }: any) => {
            if (
              covers?.some(({ coverType }: any) => coverType === 'SHORT_TERM')
            ) {
              return this.messagingService.send({
                app: 'MS_CONTROL',
                pattern: 'camera-events:update',
                payload: {
                  cameraEventId: entryEventId,
                  hasParkingRight: true,
                },
              });
            }

            return Promise.resolve();
          }),
        );
      })

      .build();
  }
}
