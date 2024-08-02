import { MessagingModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CreateFpsService } from '../create-fps/create-fps.service';
import { SessionExitService } from './session-exit.service';

@Module({
  imports: [MessagingModule, UtilModule],
  providers: [SessionExitService],
  exports: [SessionExitService],
})
export class SessionExitModule {}
