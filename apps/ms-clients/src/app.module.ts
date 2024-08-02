import { CommonModule, MongoModule } from '@lib/modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule } from './clients/clients.module';
import { appConfig } from './common/config/config';
import { PmsTechnicalUsersModule } from './pms-techical-users/pms-technical-users.module';
import { SitesModule } from './sites/sites.module';
import { TerminalsModule } from './terminals/terminals.module';
import { UpsModule } from './ups/ups.module';

@Module({
  imports: [
    CacheModule.register(),
    CommonModule.register({ appConfig }),
    MongoModule.connect(),
    ClientsModule,
    UpsModule,
    SitesModule,
    TerminalsModule,
    ScheduleModule.forRoot(),
    PmsTechnicalUsersModule,
  ],
})
export class AppModule {}
