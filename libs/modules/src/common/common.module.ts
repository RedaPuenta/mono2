import { AppConfigEnv, AppConfigType } from '@lib/configs';
import { AllExceptionFilter } from '@lib/filters';
import {
  ErrorInterceptor,
  LogInterceptor,
  NewrelicInterceptor,
  TimeoutInterceptor,
} from '@lib/interceptors';
import { GlobalValidationPipe } from '@lib/pipes';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HealthModule } from '../health/health.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({})
export class CommonModule {
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
        MessagingModule,
        HealthModule.register({ appConfig }),
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ErrorInterceptor,
        },
        {
          provide: APP_PIPE,
          useClass: GlobalValidationPipe,
        },
        {
          provide: APP_FILTER,
          useClass: AllExceptionFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LogInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: TimeoutInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: NewrelicInterceptor,
        },
      ],
    };
  }
}
