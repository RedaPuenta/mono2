import { MessagingModule, TokenModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CreateFpsService } from './create-fps.service';

@Module({
  imports: [MessagingModule, TokenModule],
  providers: [CreateFpsService],
  exports: [CreateFpsService],
})
export class CreateFpsModule {}
