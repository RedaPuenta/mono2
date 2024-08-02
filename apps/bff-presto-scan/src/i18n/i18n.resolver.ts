import { FrontGuard } from '@lib/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { DictionaryEntity } from './entities/dictionary.entity';
import { I18nService } from './i18n.service';

@Resolver((of: any) => DictionaryEntity)
@UseGuards(FrontGuard)
export class I18nResolver {
  constructor(private i18nService: I18nService) {}

  // -------------------------
  // Get global dictionary
  // -------------------------
  @Query(() => DictionaryEntity, { name: 'i18n' })
  async i18n(
    @Args('key', { nullable: true }) key: string,
  ): Promise<DictionaryEntity> {
    const dictionaryKey = key || 'bff-prestoscan-global';
    const { dictionary } = await this.i18nService.read({
      dictionaryKey,
    });
    return dictionary as DictionaryEntity;
  }
}
