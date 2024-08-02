import { HashingModule, MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CameraEventsController } from './camera-events.controller';
import { CameraEventsService } from './camera-events.service';
import { CameraEvent, EventSchema } from './schemas/camera-events.schema';

@Module({
  imports: [
    MongoModule.collection([{ name: CameraEvent.name, schema: EventSchema }]),
    HashingModule,
  ],
  controllers: [CameraEventsController],
  providers: [CameraEventsService],
})
export class CameraEventsModule {}
