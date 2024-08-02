import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppConfigType } from '../../../configs';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
    private healthService: HealthService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async ping() {
    const { specimen, naming } = this.configService.get('app', {
      infer: true,
    })!;

    await this.healthService.ping({
      domain: 'yoonite',
      type: specimen,
      key: naming,
    });
  }
}
