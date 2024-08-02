import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { Terminal, TerminalSchema } from './schemas/terminal.schema';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';

@Module({
  imports: [
    MongoModule.collection([{ name: Terminal.name, schema: TerminalSchema }]),
  ],
  providers: [TerminalsService],
  controllers: [TerminalsController],
})
export class TerminalsModule {}
