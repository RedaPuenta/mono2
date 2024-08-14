import { MongoModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { UpsModule } from '../ups/ups.module';
import { Site } from './schemas/site.schema';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

@Module({
  imports: [
    ClientsModule,
    UpsModule,
    MongoModule.collection([Site]),
    UtilModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
