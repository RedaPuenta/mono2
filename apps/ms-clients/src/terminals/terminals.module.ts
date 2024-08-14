import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { Terminal } from './schemas/terminal.schema';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';

@Module({
  imports: [MongoModule.collection([Terminal])],
  providers: [TerminalsService],
  controllers: [TerminalsController],
})
export class TerminalsModule {}
