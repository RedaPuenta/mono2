import { Injectable } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { MessagingService } from '../messaging/messaging.service';
import { LogService } from '../log/log.service';
import {
  AppRegistryNamingType,
  AppRegistrySpecimenType,
} from '../../../registrys';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private microserviceHealthIndicator: MicroserviceHealthIndicator,
    private mongooseHealthIndicator: MongooseHealthIndicator,
    private httpHealthIndicator: HttpHealthIndicator,
    private messagingService: MessagingService,
    private logService: LogService,
  ) {}

  public async ping({
    domain,
    type,
    key,
  }: {
    domain: 'yoonite';
    type: AppRegistrySpecimenType;
    key: AppRegistryNamingType;
  }) {
    this.logService.debug({ message: 'PING' });

    await this.messagingService.emit({
      app: 'API_HEALTH',
      pattern: 'ping',
      payload: {
        domain,
        type: type.toLowerCase(),
        key,
      },
    });
  }
}
