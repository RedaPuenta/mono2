import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ControlSessionController } from './control-sessions.controller';
import { ControlSessionsService } from './control-sessions.service';
import {
  ControlSession,
  ControlSessionSchema,
} from './schemas/control-sessions.schema';

@Module({
  imports: [
    MongoModule.collection([
      { name: ControlSession.name, schema: ControlSessionSchema },
    ]),
  ],
  controllers: [ControlSessionController],
  providers: [ControlSessionsService],
})
export class ControlSessionsModule {}
