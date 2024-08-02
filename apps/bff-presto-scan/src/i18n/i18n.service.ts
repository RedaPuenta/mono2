import { MessagingService, UtilService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { DictionaryEntity } from './entities/dictionary.entity';

@Injectable()
export class I18nService {
  constructor(
    private messagingService: MessagingService,
    private utilService: UtilService,
  ) {}

  async read({ dictionaryKey }: { dictionaryKey: string }) {
    const { dictionary: dictionaryMaster } = await this.messagingService.send<{
      dictionary: DictionaryEntity;
    }>({
      app: 'API_TOOLS',
      pattern: 'i18n:read',
      payload: { dictionaryKey },
    });

    const { dictionary: dictionaryWatermelon } =
      await this.messagingService.send<{ dictionary: DictionaryEntity }>({
        app: 'API_TOOLS',
        pattern: 'i18n:read',
        payload: { dictionaryKey: 'watermelon' },
      });

    return {
      dictionary: this.utilService.dictionariesMerge({
        master: dictionaryMaster,
        other: [dictionaryWatermelon],
      }),
    };
  }
}
