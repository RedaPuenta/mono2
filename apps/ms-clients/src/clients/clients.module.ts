import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client, ClientSchema } from './schemas/client.schema';

@Module({
  imports: [
    MongoModule.collection([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}