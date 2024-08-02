import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { Camera } from './schemas/camera.schema';

@Module({
  imports: [MongoModule.collection([Camera])],
  controllers: [CamerasController],
  providers: [CamerasService],
})
export class CamerasModule {}
