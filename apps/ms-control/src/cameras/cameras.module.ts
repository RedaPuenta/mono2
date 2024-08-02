import { HashingModule, MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { Camera, CameraSchema } from './schemas/camera.schema';

@Module({
  imports: [
    MongoModule.collection([{ name: Camera.name, schema: CameraSchema }]),
  ],
  controllers: [CamerasController],
  providers: [CamerasService],
})
export class CamerasModule {}
