import { Flow, MessagingService, TokenService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DateTime } from 'luxon';
import { SagaBuilder } from 'yoonite-saga';
import { ControlSession } from '../../../control-sessions/entities/controlSession.entity';
import { CreateFpsDto } from '../../../fps/dto/create-fps.dto';

@Injectable()
export class CreateFpsService extends Flow {
  constructor(
    private messagingService: MessagingService,
    private tokenService: TokenService,
  ) {
    super();
  }

  build<Context>(initialContext: Context) {
    const builder = new SagaBuilder();

    return builder
      .step('Inject initial context')
      .invoke((ctx: any) => ({ ...ctx, ...initialContext }))

      .step('Validate')
      .validate(CreateFpsDto)

      .step('fetch linked ups')
      .invoke(async ({ upsId }: any) => {
        const { client, ups, computedConfig } =
          await this.messagingService.send<any>({
            app: 'MS_CLIENT',
            pattern: 'ups:config',
            payload: { upsId },
          });

        return {
          ups,
          client,
          computedConfig,
          fpsSystem: computedConfig?.fps?.system,
        };
      })

      .step('fetch linked control user')
      .invoke(async ({ userId }: any) => {
        const { controlUser } = await this.messagingService.send<any>({
          app: 'MS_CONTROL',
          pattern: 'users:read',
          payload: { userId },
        });
        return { controlUser };
      })

      .step('fetch linked session')
      .invoke(async ({ sessionId }: any) => {
        const { session }: { session: ControlSession } =
          await this.messagingService.send({
            app: 'MS_CONTROL',
            pattern: 'sessions:read',
            payload: {
              id: sessionId,
            },
          });

        console.log('🚀 ~ CreateFpsWorkflow ~ .invoke ~ session:', session);
        return { parkingRights: session.significantRights || [] };
      })

      .step('project data')
      .invoke(
        async ({
          controlUser,
          statementDatetime,
          client,
          ups,
          upsId,
          type,
          terminalId,
          licensePlate,
          vehicle,
          parkId,
          computedConfig,
          rootFineLegalId,
          parkingRights,
          comments,
          pictures,
          payments,
          paymentStatus,
        }: any) => {
          const {
            fpsAgentId,
            fpsOrderCount,
            authorityId,
            firstName,
            lastName,
          } = controlUser;

          const authId = this.tokenService.sign({
            agentId: fpsAgentId,
            issuedAt: statementDatetime,
          });

          const zoneId = computedConfig.p1000.legacyId;
          const cityId = client.siret;

          const fpsFineVal = await this.messagingService.send<any>({
            app: 'API_LEGACY',
            pattern: 'show:fine-value',
            payload: {
              authId,
              upsId,
              licensePlate,
              vehicle,
              zoneId,
              parkId: '',
              cityId,
              statementDatetime,
              tickets: parkingRights,
            },
          });

          console.log(
            "🚀 ~ CreateFpsWorkflow ~ build ~  'api:legacy:show:fine-value'",
            {
              authId,
              upsId,
              licensePlate,
              vehicle,
              zoneId,
              parkId: '',
              cityId,
              statementDatetime,
              tickets: parkingRights,
            },
          );
          console.log(
            '🚀 ~ CreateFpsWorkflow ~ build ~ fpsFineVal:',
            fpsFineVal,
          );

          const nextOrderNumber = fpsOrderCount === 999 ? 1 : fpsOrderCount + 1;
          const authorityIdFormatted = authorityId || '1';
          const orderNumberFormatted = nextOrderNumber
            .toString()
            .padStart(3, '0');
          const fpsAgentIdFormatted = fpsAgentId.toString().padStart(3, '0');
          const statementYear = DateTime.fromISO(
            statementDatetime,
          ).toLocaleString({ year: '2-digit' });

          const statementDay = DateTime.fromISO(statementDatetime)
            .ordinal.toString()
            .padStart(3, '0');

          // Compose everything
          const fineLegalId = [
            client.siret,
            statementYear,
            authorityIdFormatted,
            statementDay,
            fpsAgentIdFormatted,
            orderNumberFormatted,
          ].join('');

          const agent = {
            name: `${firstName} ${lastName}`,
            agentId: fpsAgentId,
            worksFor: computedConfig.fps.recourseOrganization,
          };

          const statementAddress = ups.address;
          const statementLocation = {
            latitude: ups.center[1],
            longitude: ups.center[0],
            altitude: 0,
            incertitude: 0,
          };

          const recourseOrganization = computedConfig.fps.recourseOrganization;

          const fpsData = {
            upsId,
            type,
            zoneId,
            fineLegalId,
            rootFineLegalId,
            authId,
            agent,
            cityId,
            terminalId,
            licensePlate,
            vehicle,
            parkId,
            statementAddress,
            statementDatetime,
            statementLocation,
            notificationAuthority: computedConfig.fps.notificationAuthority,
            validityDatetime:
              fpsFineVal.fps?.validityDatetime ||
              DateTime.fromISO(statementDatetime).toISO(),
            reducedDatetime:
              fpsFineVal.fps?.reducedDatetime ||
              DateTime.fromISO(statementDatetime).toISO(),
            finePrice: fpsFineVal.fps?.finePrice || 0,
            reducedFinePrice: fpsFineVal.fps?.reducedFinePrice || 0,
            reducedPriceDuration: fpsFineVal.fps?.reducedPriceDuration || 0,
            significantRights: parkingRights.map(
              ({ zoneId, ...rest }: any) => ({
                ...rest,
                zoneId: zoneId.length ? zoneId[0] : null,
              }),
            ),
            payments,
            paymentStatus,
            recourseOrganization,
            comments,
            pictures,
          };

          return {
            fpsData,
            orderNumber: nextOrderNumber,
          };
        },
      )

      .step('Push fps to dedicated fps system')
      .condition(({ fpsSystem }: any) => fpsSystem === 'iem')
      .invoke(async ({ fpsData }: any) => {
        const { fps } = await this.messagingService.send<any>({
          app: 'API_LEGACY',
          pattern: 'fps:create',
          payload: {
            ...fpsData,
          },
        });

        if (!fps)
          throw new RpcException({
            code: 'ACTR_5',
            message: 'Fps creation error',
          });

        return { fpsCreated: fps.data };
      })

      .step('Save created fps')
      .invoke(async ({ fpsCreated, upsId }: any) => {
        const fps = await this.messagingService.send<any>({
          app: 'MS_CONTROL',
          pattern: 'fps:create',
          payload: {
            upsId,
            ...fpsCreated,
          },
        });

        return { fps: fps.created };
      })

      .step('update control user fps count')
      .invoke(async ({ userId, orderNumber }: any) => {
        const { controlUser } = await this.messagingService.send<any>({
          app: 'MS_CONTROL',
          pattern: 'users:update',
          payload: {
            userId,
            fpsOrderCount: orderNumber,
          },
        });

        return { controlUser };
      })

      .step('update control state')
      .invoke(async ({ sessionId }: any) => {
        await this.messagingService.send({
          app: 'MS_CONTROL',
          pattern: 'seesions:update',
          payload: {
            id: sessionId,
            update: {
              controlState: 'FINED',
            },
          },
        });
      })

      .build();
  }
}
