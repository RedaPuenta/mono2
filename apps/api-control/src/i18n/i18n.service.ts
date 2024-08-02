import { UpsEntityType } from '@lib/data';
import { MessagingService, UtilService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class I18nService {
  constructor(
    private messagingService: MessagingService,
    private utilService: UtilService,
  ) {}

  // --------------------
  // Re-generate all prestoscan's translations
  // --------------------
  async generateTranslations() {
    // Get all prestoscan UPS to translate (handle pagination)
    const controlledUps = await Promise.all(
      await this.utilService.paginatedProcessor(
        () =>
          this.messagingService.send<any>({
            app: 'MS_CLIENT',
            pattern: 'ups:search',
            payload: { isPrestoscan: true },
          }),
        async (ups: UpsEntityType) => ups,
      ),
    );

    // If no UPS to handle, just return
    if (!controlledUps.length) return;

    // Group translations by lang
    const tranlationsGroupedByLang = this.getTranslationsGroupedByLang(
      'ups',
      controlledUps,
      ['name'],
    );

    // Get languages
    const acceptedLanguages = Object.keys(tranlationsGroupedByLang);

    // Merge tranlations
    const results = await Promise.all(
      acceptedLanguages.map((lang) =>
        this.messagingService.send({
          app: 'API_TOOLS',
          pattern: 'api:tools:i18n:merge',
          payload: {
            key: `bff-prestoscan-global`,
            lang,
            translations: tranlationsGroupedByLang[lang],
          },
        }),
      ),
    );

    return results;
  }

  // --------------------
  // Get all translations in entitie grouped by lang with only "fields" properties
  // --------------------
  getTranslationsGroupedByLang(type: any, entities: any, fields: any) {
    return entities
      .map(({ _id, translation }: any) =>
        translation.reduce(
          (acc: any, { lang, ...rest }: any) => {
            const selectedFields = Object.entries(rest).reduce(
              (acc, [key, value]) =>
                fields.includes(key)
                  ? { ...acc, [`${type}-${_id}-${key}`]: value }
                  : acc,
              {},
            );
            return { ...acc, [lang]: selectedFields };
          },

          {},
        ),
      )
      .reduce((acc: any, translation: any) => {
        Object.entries(translation).forEach(([lang, list]: any) => {
          if (!acc[lang]) acc[lang] = {};
          acc[lang] = { ...acc[lang], ...list };
        });
        return acc;
      }, {});
  }
}
