import { Module } from '@nestjs/common';
import { I18nController } from './i18n.controller';
import { I18nService } from './i18n.service';
import { MessagingModule, UtilModule } from '@lib/modules';

@Module({
  imports: [MessagingModule, UtilModule],
  controllers: [I18nController],
  providers: [I18nService],
})
export class I18nModule {}
