import { CommonModule, HashingModule } from '@lib/modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { CameraEventsModule } from './camera-events/camera-events.module';
import { CamerasModule } from './cameras/cameras.module';
import { appConfig } from './common/config/config';
import { ControlSessionsModule } from './control-sessions/control-sessions.module';
import { FpsModule } from './fps/fps.module';
import { I18nModule } from './i18n/i18n.module';
import { P1000Module } from './p1000/p1000.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    CommonModule.register({ appConfig }),
    ScheduleModule.forRoot(),
    PassportModule,
    UsersModule,
    CameraEventsModule,
    CamerasModule,
    ControlSessionsModule,
    I18nModule,
    P1000Module,
    FpsModule,
    HashingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
