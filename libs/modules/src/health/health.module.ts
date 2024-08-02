import { AppConfigEnv, AppConfigType } from '@lib/configs';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../common/common.module';
import { LogModule } from '../log/log.module';
import { MessagingModule } from '../messaging/messaging.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({})
export class HealthModule {
  static register({
    appConfig,
  }: {
    appConfig: () => AppConfigType;
  }): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        ConfigModule.forRoot({
          ...AppConfigEnv,
          isGlobal: true,
          load: [appConfig],
        }),
        ScheduleModule.forRoot(),
        MessagingModule,
        LogModule,
        TerminusModule,
      ],
      providers: [HealthService],
      controllers: [HealthController],
      exports: [HealthService],
    };
  }
}
