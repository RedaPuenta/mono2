import { MessagingModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { P1000Module } from '../../../p1000/p1000.module';
import { SessionRefreshService } from './session-refresh.service';

@Module({
  imports: [MessagingModule, UtilModule, P1000Module],
  providers: [SessionRefreshService],
  exports: [SessionRefreshService],
})
export class SessionRefreshModule {}
