import { Module } from '@nestjs/common';
import { ControlSessionsResolver } from './control-sessions.resolver';
import { MessagingModule } from '@lib/modules';

@Module({
  imports: [MessagingModule],
  exports: [],
  providers: [ControlSessionsResolver],
})
export class ControlSessionsModule {}
