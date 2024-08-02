import { MessagingModule, WorkflowModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { appConfig } from '../common/config/config';
import { CreateFpsModule } from '../common/flows/create-fps/create-fps.module';
import { FpsController } from './fps.controller';
import { FpsService } from './fps.service';

@Module({
  imports: [
    MessagingModule,
    WorkflowModule.register({ appConfig, includes: [CreateFpsModule] }),
  ],
  providers: [FpsService],
  controllers: [FpsController],
  exports: [FpsService],
})
export class FpsModule {}
