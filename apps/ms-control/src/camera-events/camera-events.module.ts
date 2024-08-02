import { HashingModule, MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CameraEventsController } from './camera-events.controller';
import { CameraEventsService } from './camera-events.service';
import { CameraEvent } from './schemas/camera-events.schema';

@Module({
  imports: [MongoModule.collection([CameraEvent]), HashingModule],
  controllers: [CameraEventsController],
  providers: [CameraEventsService],
})
export class CameraEventsModule {}
