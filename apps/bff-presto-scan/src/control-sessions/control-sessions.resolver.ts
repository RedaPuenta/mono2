import { TerminalAlarmComposeType } from '@lib/data';
import { User } from '@lib/decorators';
import { FrontGuard, LoginGuard } from '@lib/guards';
import { MessagingService } from '@lib/modules';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ControlCameraEventEntity } from '../camera-events/entities/camera-event.entity';
import { UpsEntity } from '../ups/entities/ups.entity';
import {
  SearchControlSessionDto,
  SearchControlSessionResponseDto,
} from './dto/search-control-sessions.dto';
import { UpdateControlSessionsDto } from './dto/update-control-sessions.dto';
import {
  ControlSessionEntity,
  TerminalStateEntity,
} from './entities/control-session.entity';

@UseGuards(FrontGuard, LoginGuard)
@Resolver(() => ControlSessionEntity)
export class ControlSessionsResolver {
  constructor(private messagingService: MessagingService) {}

  //! J'ai mis dans une fonction car c'est bien plus complexe que juste --> OUT_OF_ORDER
  //! Y a une histoire de combo
  private interpretTerminalState(
    alarms: TerminalAlarmComposeType[],
  ): TerminalAlarmComposeType[] {
    return alarms.filter(({ level }) => level === 'OUT_OF_ORDER');
  }

  @Query(() => ControlSessionEntity)
  async session(@Args('id') id: string): Promise<ControlSessionEntity> {
    const session = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'sessions:read',
      payload: {
        id,
      },
    });

    return session;
  }

  @ResolveField()
  async terminalState(
    @Parent() session: ControlSessionEntity,
  ): Promise<TerminalStateEntity[]> {
    const terminalsHealth = session?.healthSummary?.terminalsHealth || [];

    const test = terminalsHealth.reduce(
      (acc: any, { terminalId, alarms = [] }: any) => {
        const alarmsDown = this.interpretTerminalState(alarms);
        return [
          ...acc,
          ...alarmsDown.map(({ name, startDate, endDate }) => ({
            name,
            terminalId,
            startDate,
            endDate,
          })),
        ];
      },
      [],
    );

    return test;
  }

  @Query(() => SearchControlSessionResponseDto)
  async sessions(
    @User() user: any,
    @Args() searchParams: SearchControlSessionDto,
  ): Promise<SearchControlSessionResponseDto> {
    const { minUncoveredDuration, upsId } = searchParams;
    if (!user.ups.find((ups: any) => ups === upsId)) {
      return { list: [], paging: { current: 1, count: 0, limit: 0 } };
    }
    const { list, paging } =
      await this.messagingService.send<SearchControlSessionResponseDto>({
        app: 'API_CONTROL',
        pattern: 'sessions:search',
        payload: {
          ...searchParams,
          controlState: 'TO_CONTROL',
          isExposed: true,
          'healthSummary.terminalsHealth': {
            $not: { $elemMatch: { alive: false } },
          },
          maxSessionDurationInHours: 72,
          uncoveredDuration: { $gte: minUncoveredDuration || 1 },
        },
      });

    return { list, paging };
  }

  @Mutation(() => ControlSessionEntity)
  async updateSession(
    @Args('sessionId') sessionId: string,
    @Args('input') params: UpdateControlSessionsDto,
  ): Promise<ControlSessionEntity> {
    const { session } = await this.messagingService.send<{
      session: ControlSessionEntity;
    }>({
      app: 'API_CONTROL',
      pattern: 'sessions:update',
      payload: {
        update: { ...params },
        id: sessionId,
      },
    });

    return session;
  }

  @ResolveField()
  async entryEvent(
    @Parent() session: ControlSessionEntity,
  ): Promise<ControlCameraEventEntity> {
    const { entryEventId } = session;
    const { cameraEvent } = await this.messagingService.send<{
      cameraEvent: ControlCameraEventEntity;
    }>({
      app: 'API_CONTROL',
      pattern: 'camera-events:read',
      payload: {
        cameraEventId: entryEventId,
      },
    });

    return cameraEvent;
  }

  @ResolveField()
  async exitEvent(
    @Parent() session: ControlSessionEntity,
  ): Promise<ControlCameraEventEntity | null> {
    const { exitEventId } = session;
    if (!exitEventId) return null;

    const { cameraEvent } = await this.messagingService.send<{
      cameraEvent: ControlCameraEventEntity;
    }>({
      app: 'API_CONTROL',
      pattern: 'camera-events:read',
      payload: {
        cameraEventId: exitEventId,
      },
    });
    return cameraEvent;
  }

  @ResolveField()
  async ups(@Parent() session: ControlSessionEntity): Promise<UpsEntity> {
    const { upsId } = session;

    const { ups } = await this.messagingService.send<any>({
      app: 'API_ONSTREET',
      pattern: 'ups:read',
      payload: {
        _id: upsId,
      },
    });

    return ups;
  }

  @ResolveField()
  async previousClaimsForUser(@Parent() session: ControlSessionEntity) {
    const length = session?.controlCtx?.claims?.length;
    return typeof length === 'number' ? length > 0 : false;
  }

  @ResolveField()
  async allTerminalsAreAlive(@Parent() session: ControlSessionEntity) {
    return session?.healthSummary?.terminalsHealth?.every(
      (terminalHealth) => terminalHealth.alive,
    );
  }
}
