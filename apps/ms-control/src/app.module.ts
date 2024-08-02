import { CommonModule, MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasModule } from './cameras/cameras.module';
import { appConfig } from './common/config/config';
import { ControlSessionsModule } from './control-sessions/control-sessions.module';
import { FpsModule } from './fps/fps.module';
import { UsersModule } from './users/users.module';
import { CameraEventsModule } from './camera-events/camera-events.module';

@Module({
  imports: [
    CommonModule.register({ appConfig }),
    CamerasModule,
    UsersModule,
    ControlSessionsModule,
    FpsModule,
    CameraEventsModule,
    MongoModule.connect(),
  ],
})
export class AppModule {}
