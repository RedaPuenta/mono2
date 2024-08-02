import { Subscribe } from '@lib/decorators';
import { MessagingService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { CreateCameraDto } from './dto/create-camera.dto';
import { DeleteCameraDto } from './dto/delete-camera.dto';
import { ReadCameraDto } from './dto/read-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { Camera } from './entites/camera.entity';
import {
  SearchCameraDto,
  SearchCameraResponseDto,
} from './dto/search-cameras.dto';

@Controller('cameras')
export class CamerasController {
  constructor(private messagingService: MessagingService) {}

  @Subscribe(appConfig(), `cameras:create`)
  async create(
    @Payload() createParams: CreateCameraDto,
  ): Promise<{ camera: Camera }> {
    const { camera } = await this.messagingService.send<{ camera: Camera }>({
      app: 'MS_CONTROL',
      pattern: 'cameras:create',
      payload: createParams,
    });

    return { camera };
  }

  @Subscribe(appConfig(), `cameras:read`)
  @MessagePattern({ cmd: 'api:control:cameras:read' })
  async read(
    @Payload() readParams: ReadCameraDto,
  ): Promise<{ camera: Camera }> {
    const { camera } = await this.messagingService.send<{ camera: Camera }>({
      app: 'MS_CONTROL',
      pattern: 'cameras:read',
      payload: readParams,
    });

    return { camera };
  }

  @Subscribe(appConfig(), `cameras:update`)
  async update(
    @Payload() updateParams: UpdateCameraDto,
  ): Promise<{ camera: Camera }> {
    const { cameraId, ...updateData } = updateParams;

    const { camera } = await this.messagingService.send<{ camera: Camera }>({
      app: 'MS_CONTROL',
      pattern: 'cameras:update',

      payload: {
        cameraId,
        ...updateData,
      },
    });

    return { camera };
  }

  @Subscribe(appConfig(), `cameras:search`)
  async search(
    @Payload() searchParams: SearchCameraDto,
  ): Promise<SearchCameraResponseDto> {
    const { list, paging } =
      await this.messagingService.send<SearchCameraResponseDto>({
        app: 'MS_CONTROL',
        pattern: 'cameras:search',
        payload: searchParams,
      });

    return { list, paging };
  }

  @Subscribe(appConfig(), `cameras:delete`)
  async delete(
    @Payload() params: DeleteCameraDto,
  ): Promise<{ camera: Camera }> {
    const { camera } = await this.messagingService.send<{ camera: Camera }>({
      app: 'MS_CONTROL',
      pattern: 'cameras:delete',
      payload: params,
    });

    return { camera };
  }
}
