import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { FpsResolver } from './fps.resolver';

@Module({
  imports: [MessagingModule],
  exports: [],
  providers: [FpsResolver],
})
export class FpsModule {}
