import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { appConfig } from '../common/config/config';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private service: I18nService) {}

  @Subscribe(appConfig(), `i18n:generate-translations`)
  async generateOperator(): Promise<any> {
    return this.service.generateTranslations();
  }
}
