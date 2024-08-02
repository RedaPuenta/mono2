import { MessagingModule, UtilModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { I18nResolver } from './i18n.resolver';
import { I18nService } from './i18n.service';

@Module({
  imports: [MessagingModule, UtilModule],
  providers: [I18nService, I18nResolver],
})
export class I18nModule {}
