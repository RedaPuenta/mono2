import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { Camera } from './schemas/camera.schema';
import { MongoService } from '@lib/modules';

@Injectable()
export class CamerasService extends MongoService<Camera> {
  constructor(@InjectModel(Camera.name) protected model: Model<Camera>) {
    super(model);
  }
  // --------------------
  // Handle customize search fields
  // --------------------
  async paramize(params: any): Promise<any> {
    const search: any = {};

    const promises = Object.keys(params).map(async (key) => {
      const value = params[key];

      switch (key) {
        case 'cameraId':
          search['_id'] = value;
          break;
        default:
          search[key] = value;
          break;
      }
    });

    await Promise.all(promises);

    return search;
  }
  // --------------------
  // Create a camera
  // --------------------
  async create(createParams: CreateCameraDto) {
    const { code, position, ups, description } = createParams;

    const camera = new this.model({
      code,
      position,
      ups,
      description,
    });

    return camera.save();
  }

  // --------------------
  // Update an event
  // --------------------
  async updateOne(
    cameraId: string,
    updateParams: UpdateCameraDto,
  ): Promise<Camera> {
    return this.update(cameraId, updateParams);
  }
}
