import { CommonModule, TokenModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@lib/modules';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CameraEventsModule } from './camera-events/camera-events.module';
import { CamerasModule } from './cameras/cameras.module';
import { appConfig } from './common/config/config';
import { ControlSessionsModule } from './control-sessions/control-sessions.module';
import { ControlUsersModule } from './control-users/control-users.module';
import { FpsModule } from './fps/fps.module';
import { I18nModule } from './i18n/i18n.module';
import { ResourcesModule } from './resources/resources.module';
import { UpsModule } from './ups/ups.module';
import { ExportsModule } from './exports/exports.module';

@Module({
  imports: [
    TokenModule,
    CommonModule.register({ appConfig }),
    ScheduleModule.forRoot(),
    ResourcesModule,
    GraphQLModule.forRoot({
      include: [
        AuthModule,
        I18nModule,
        CameraEventsModule,
        ControlUsersModule,
        CamerasModule,
        ControlSessionsModule,
        FpsModule,
        UpsModule,
      ],
    }),
    ExportsModule,
  ],
})
export class AppModule {}
