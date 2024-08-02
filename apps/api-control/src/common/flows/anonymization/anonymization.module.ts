import { HashingModule, MessagingModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { AnonymizationService } from './anonymization.service';

@Module({
  imports: [MessagingModule, HashingModule, UtilModule],
  providers: [AnonymizationService],
  exports: [AnonymizationService],
})
export class AnonymizationModule {}
