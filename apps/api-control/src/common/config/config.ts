import { AppConfig } from '@lib/configs';
import { registerAs } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';

export const appConfig = AppConfig('API_CONTROL');

export const cronConfig = registerAs('cron', () =>
  Object.freeze({
    sessionAnonymization:
      process.env.CRON_SESSION_ANONYMIZATION ||
      CronExpression.EVERY_DAY_AT_MIDNIGHT,
    eventAnonymization:
      process.env.CRON_EVENT_ANONYMIZATION || CronExpression.EVERY_DAY_AT_1AM,
    sessionRefresh:
      process.env.CRON_SESSION_REFRESH || CronExpression.EVERY_5_MINUTES,
  } as const),
);

export const prestoplatformConfig = registerAs('prestoplatform', () =>
  Object.freeze({
    host:
      process.env.REACT_APP_HOST_LEGACY_API ||
      'https://apiwork.prestoplatform.io/v1',
    token:
      process.env.REACT_APP_HOST_LEGACY_API_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN5bHZhaW4uYWxib3JpbmlAc29saWQuY2gifQ.JYc6FODvjs0hSmlNOqEF1_uvZrtbMhXCIW5C4H3ALzc',
  } as const),
);
