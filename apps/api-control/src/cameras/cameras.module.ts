import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';

@Module({
  imports: [MessagingModule],
  controllers: [CamerasController],
})
export class CamerasModule {}
