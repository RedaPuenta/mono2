import { Subscribe } from '@lib/decorators';
import { HashingService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { DeleteDto } from '../common/types/generic.dto';
import { CameraEventsService } from './camera-events.service';
import { AnonymizeCameraEventsDto } from './dto/anonymize-camera-events.dto';
import { AnonymizeOrfansDto } from './dto/anonymize-orfans.dto';

import { ReadCameraEventDto } from './dto/read-camera-events.dto';
import { SearchCameraEventDto } from './dto/search-camera-events.dto';
import { UpdateCameraEventDto } from './dto/update-camera-events.dto';
import { CameraEvent } from './schemas/camera-events.schema';
import { CreateCameraEventDto } from './dto/create-camera-events.dto';

@Controller('camera-events')
export class CameraEventsController {
  constructor(
    private service: CameraEventsService,
    private hashingService: HashingService,
  ) {}

  @Subscribe(appConfig(), `camera-events:create`)
  async upsert(
    @Payload() createParams: CreateCameraEventDto,
  ): Promise<{ cameraEvent: CameraEvent }> {
    const cameraEvent = await this.service.createOne(createParams);
    return { cameraEvent };
  }

  @Subscribe(appConfig(), `camera-events:read`)
  async read(
    @Payload() readParams: ReadCameraEventDto,
  ): Promise<{ cameraEvent: any }> {
    const cameraEvent = await this.service.read(readParams);
    return { cameraEvent };
  }

  @Subscribe(appConfig(), `camera-events:update`)
  async update(
    @Payload() updateParams: UpdateCameraEventDto,
  ): Promise<{ cameraEvent: any }> {
    const { cameraEventId } = updateParams;
    const cameraEvent = await this.service.update(cameraEventId, updateParams);
    return { cameraEvent };
  }

  @Subscribe(appConfig(), `camera-events:search`)
  async search(
    @Payload() searchParams: SearchCameraEventDto,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order = '-createdAt', ...searchData } = searchParams;
    const { list, paging } = await this.service.paging(searchData, {
      page,
      limit,
      order,
    });
    const formattedList = await this.service.render<CameraEvent[]>(list);
    return { list: formattedList, paging };
  }

  @Subscribe(appConfig(), `camera-events:delete`)
  async delete(@Payload() { id }: DeleteDto): Promise<boolean> {
    await this.service.remove(id);
    return true;
  }

  /**
   * Anonymize camera events and send back the list of resources that need
   * to be deleted from the storage
   */
  @Subscribe(appConfig(), `camera-events:anonymize`)
  async anonymize(@Payload() { ids }: AnonymizeCameraEventsDto): Promise<any> {
    const { list: cameraEvents } = await this.service.paging({
      _id: { $in: [...ids] },
      knownLpn: true,
    });

    cameraEvents.forEach(async ({ _id, vehicle }) => {
      if (vehicle.lpn) {
        await this.service.update(_id, {
          vehicle: {
            ...vehicle,
            lpn: this.hashingService.hash({
              payload: vehicle.lpn,
              algorithm: 'md5',
              digest: 'hex',
              length: 12,
            }),
            isAnonymised: true,
          },
          resources: [],
        });
      }
    });

    return cameraEvents.flatMap(({ resources }) => resources);
  }

  @Subscribe(appConfig(), `camera-events:anonymizeOrphans`)
  async anonymizeOrphansAndGetResources(
    @Payload() { deletionDelays }: AnonymizeOrfansDto,
  ): Promise<string[]> {
    return this.service.anonymizeOrphansAndGetResources(deletionDelays);
  }
}
