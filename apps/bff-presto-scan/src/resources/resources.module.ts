import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Module({
  imports: [MessagingModule],
  exports: [ResourcesService],
  providers: [ResourcesService],
})
export class ResourcesModule {}
