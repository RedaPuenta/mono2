import { MessagingModule, WorkflowModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { appConfig } from '../common/config/config';
import { AnonymizationModule } from '../common/flows/anonymization/anonymization.module';
import { SessionRefreshModule } from '../common/flows/session-refresh/session-refresh.module';
import { ControlSessionsController } from './control-sessions.controller';

@Module({
  imports: [
    MessagingModule,
    WorkflowModule.register({
      appConfig,
      includes: [SessionRefreshModule, AnonymizationModule],
    }),
  ],
  controllers: [ControlSessionsController],
  providers: [],
  exports: [],
})
export class ControlSessionsModule {}
