import { MongoModule, UtilModule } from '@lib/modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { Ups } from './schemas/ups.schema';
import { UpsController } from './ups.controller';
import { UpsService } from './ups.service';

@Module({
  imports: [
    CacheModule.register(),
    MongoModule.collection([Ups]),
    ClientsModule,
    UtilModule,
  ],
  providers: [UpsService],
  controllers: [UpsController],
  exports: [UpsService],
})
export class UpsModule {}
