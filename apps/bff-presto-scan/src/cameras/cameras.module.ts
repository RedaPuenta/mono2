import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasResolver } from './cameras.resolver';
import { CamerasService } from './cameras.service';

@Module({
  imports: [MessagingModule],
  exports: [CamerasService],
  providers: [CamerasResolver, CamerasService],
})
export class CamerasModule {}
