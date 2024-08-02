import { MessagingModule, WorkflowModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { appConfig } from '../common/config/config';
import { SessionEntryModule } from '../common/flows/session-entry/session-entry.module';
import { SessionExitModule } from '../common/flows/session-exit/session-exit.module';
import { CameraEventsController } from './camera-events.controller';

@Module({
  imports: [
    MessagingModule,
    WorkflowModule.register({
      appConfig,
      includes: [SessionEntryModule, SessionExitModule],
    }),
  ],
  controllers: [CameraEventsController],
})
export class CameraEventsModule {}
