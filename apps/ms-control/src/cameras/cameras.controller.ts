import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CamerasService } from './cameras.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { DeleteCameraDto } from './dto/delete-camera.dto';
import { ReadCameraDto } from './dto/read-camera.dto';
import { SearchCameraDto } from './dto/search-cameras.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { Camera } from './schemas/camera.schema';
import { appConfig } from '../common/config/config';
import { Subscribe } from '@lib/decorators';

@Controller('cameras')
export class CamerasController {
  constructor(private service: CamerasService) {}

  @Subscribe(appConfig(), `cameras:create`)
  async create(
    @Payload() createCameraDto: CreateCameraDto,
  ): Promise<{ camera: any }> {
    const cameraCreate = await this.service.create(createCameraDto);

    return { camera: cameraCreate };
  }

  @Subscribe(appConfig(), `cameras:read`)
  async read(@Payload() readParams: ReadCameraDto): Promise<{ camera: any }> {
    const camerasRead = await this.service.read(readParams);
    return { camera: camerasRead };
  }

  @Subscribe(appConfig(), `cameras:update`)
  async update(
    @Payload() updateParams: UpdateCameraDto,
  ): Promise<{ camera: any }> {
    const { cameraId } = updateParams;
    const cameraUpdate = await this.service.updateOne(cameraId, updateParams);
    return { camera: cameraUpdate };
  }

  @Subscribe(appConfig(), `cameras:search`)
  async search(
    @Payload() searchParams: SearchCameraDto,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order = '-createdAt', ...searchData } = searchParams;
    const { list, paging } = await this.service.paging(searchData, {
      page,
      limit,
      order,
    });
    const formattedList = await this.service.render<Camera[]>(list);
    return { list: formattedList, paging };
  }

  @Subscribe(appConfig(), `cameras:delete`)
  async delete(@Payload() params: DeleteCameraDto): Promise<{ camera: any }> {
    const { cameraId } = params;
    const camera = await this.service.delete({ _id: cameraId });
    return { camera };
  }
}
