import { Subscribe } from '@lib/decorators';
import { MessagingService, WorkflowService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { appConfig, cronConfig } from '../common/config/config';
import { CreateCameraEventDto } from './dto/create-camera-event.dto';
import { ReadCameraEventDto } from './dto/read-camera-event.dto';
import {
  SearchCameraEventDto,
  SearchCameraEventResponseDto,
} from './dto/search-camera-event.dto';
import { CameraEvent } from './entities/camera-event';
import { SessionEntryService } from '../common/flows/session-entry/session-entry.service';
import { SessionExitService } from '../common/flows/session-exit/session-exit.service';

@Controller('camera-events')
export class CameraEventsController {
  constructor(
    private messagingService: MessagingService,
    private workflowService: WorkflowService,
  ) {}

  @Subscribe(appConfig(), `camera-events:search`)
  async search(
    @Payload() searchParams: SearchCameraEventDto,
  ): Promise<SearchCameraEventResponseDto> {
    const { list, paging } =
      await this.messagingService.send<SearchCameraEventResponseDto>({
        app: 'MS_CONTROL',
        pattern: 'camera-events:search',
        payload: searchParams,
      });
    return { list, paging };
  }

  @Subscribe(appConfig(), `camera-events:read`)
  async read(
    @Payload() readParams: ReadCameraEventDto,
  ): Promise<{ cameraEvent: CameraEvent }> {
    const { cameraEvent } = await this.messagingService.send<{
      cameraEvent: CameraEvent;
    }>({
      app: 'MS_CONTROL',
      pattern: 'camera-events:read',
      payload: readParams,
    });
    return { cameraEvent };
  }

  @Subscribe(appConfig(), `camera-events:create`)
  async create(
    @Payload() createParams: CreateCameraEventDto,
  ): Promise<{ cameraEvent: CameraEvent }> {
    const { cameraEvent } = await this.messagingService.send<{
      cameraEvent: CameraEvent;
    }>({
      app: 'MS_CONTROL',
      pattern: 'camera-events:create',
      payload: createParams,
    });

    this.messagingService.emit({
      app: 'API_CONTROL',
      pattern: 'camera-events:handle-session',
      payload: cameraEvent,
    });

    return { cameraEvent };
  }

  @Subscribe(appConfig(), `camera-events:handle-session`, 'event')
  async handleSession(@Payload() eventParams: any): Promise<{ session: any }> {
    const workflows = [];
    // const {
    //   vehicle: { lpn },
    //   happenedAt,
    //   _id,
    //   channels,
    // } = eventParams;
    // const ups = (channels || []).find(
    //   ({ channel }: any) => channel === 'ups',
    // )!._id;
    if (true) workflows.push(SessionEntryService);
    if (eventParams.way === 'exit') workflows.push(SessionExitService);
    // if (!workflows.length) return { session: null };

    const {
      state,
      context: { session },
      errors,
    } = await this.workflowService.run<any>(
      {}, // { lpn, happenedAt, eventId: _id, upsId: ups },
      workflows,
    );

    // Handle errors
    if (state === 'failed') {
      const error = errors.length ? { ...errors[0]?.error } : null;

      throw new RpcException({
        code: error?.code,
        pattern: 'api:control:camera-events:create',
        message: error?.message,
        payload: error?.payload,
        tags: [],
      });
    }
    return { session };
  }

  @Subscribe(appConfig(), 'camera-events:anonymize-orphan-events')
  @Cron(cronConfig().eventAnonymization)
  async anonymizeOrphanEvents() {
    const deletionDelays = await this.messagingService.send({
      app: 'MS_CLIENT',
      pattern: 'ups:deletion-delays',
      payload: {},
      cache: { cache: true, cacheTtl: 60 * 60 * 1000 },
    });

    const resourceIds = await this.messagingService.send({
      app: 'MS_CONTROL',
      pattern: 'camera-events:anonymizeOrphans',
      payload: {
        deletionDelays,
      },
    });

    await this.messagingService.send({
      app: 'BFF_RESOURCES',
      pattern: 'deleteMany',
      payload: {
        bucket: 'presto-scan',
        ids: resourceIds,
      },
    });

    return true;
  }
}
