import { User } from '@lib/decorators';
import { FrontGuard, LoginGuard } from '@lib/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CamerasService } from '../cameras/cameras.service';
import { ControlCameraEntity } from '../cameras/entities/camera.entity';
import { ResourcesService } from '../resources/resources.service';
import { CameraEventsService } from './camera-events.service';
import {
  SearchControlCameraEventDto,
  SearchControlCameraEventResponseDto,
} from './dto/search-camera-events.dto';
import { ControlCameraEventEntity } from './entities/camera-event.entity';

@UseGuards(FrontGuard, LoginGuard)
@Resolver(() => ControlCameraEventEntity)
export class CameraEventsResolver {
  constructor(
    private service: CameraEventsService,
    private resourcesService: ResourcesService,
    private camerasService: CamerasService,
  ) {}

  @Query((returns) => SearchControlCameraEventResponseDto)
  async events(
    @User() user: any,
    @Args() searchParams: SearchControlCameraEventDto,
  ): Promise<{ list: any; paging: any }> {
    const { upsId } = searchParams;

    if (!user.ups.find((ups: any) => ups === upsId)) {
      return { list: [], paging: { current: 1, count: 0, limit: 0 } };
    }
    const { list, paging } = await this.service.search(searchParams);
    return { list, paging };
  }

  // -------------------------
  // Get an event
  // -------------------------
  @Query((returns) => ControlCameraEventEntity)
  async event(
    @Args('cameraEventId') cameraEventId: string,
  ): Promise<{ cameraEvent: ControlCameraEventEntity }> {
    const { cameraEvent } = await this.service.read(cameraEventId);
    return cameraEvent;
  }

  // -------------------------
  // Get all Ressources from this event
  // -------------------------
  @ResolveField()
  async resources(
    @Parent() event: ControlCameraEventEntity,
  ): Promise<{ list: any; paging: any }> {
    const { resources } = event;
    const { list, paging } = await this.resourcesService.search({
      resourcesIds: resources,
    });
    return { list, paging };
  }
  // -------------------------
  // Get camera linked to this event
  // -------------------------
  @ResolveField()
  async camera(
    @Parent() event: ControlCameraEventEntity,
  ): Promise<{ camera: ControlCameraEntity }> {
    const { cameraId } = event;

    const { camera } = await this.camerasService.read(cameraId);
    return camera;
  }
}
