import { MessagingModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { SessionEntryService } from './session-entry.service';

@Module({
  imports: [MessagingModule, UtilModule],
  providers: [SessionEntryService],
  exports: [SessionEntryService],
})
export class SessionEntryModule {}
