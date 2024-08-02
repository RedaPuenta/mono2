import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { UpsResolver } from './ups.resolver';
import { UpsService } from './ups.service';

@Module({
  imports: [MessagingModule],
  exports: [UpsService],
  providers: [UpsResolver, UpsService],
})
export class UpsModule {}
