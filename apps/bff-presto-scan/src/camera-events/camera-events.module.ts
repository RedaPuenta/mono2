import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasModule } from '../cameras/cameras.module';
import { ResourcesModule } from '../resources/resources.module';
import { CameraEventsResolver } from './camera-events.resolver';
import { CameraEventsService } from './camera-events.service';

@Module({
  imports: [ResourcesModule, CamerasModule, MessagingModule],
  exports: [CameraEventsService],
  providers: [CameraEventsResolver, CameraEventsService],
})
export class CameraEventsModule {}
