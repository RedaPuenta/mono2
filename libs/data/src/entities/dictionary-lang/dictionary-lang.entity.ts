import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
  UnknownValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';

export const DictionaryLangEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class DictionaryLang extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
    })
    lang!: string;

    @StringValidator({
      context,
      required: true,
      formalize: 'lowercase',
    })
    key!: string;

    @UnknownValidator({
      context,
      required: true,
      byDefault: {},
    })
    translations!: unknown;
  }

  return DictionaryLang;
};

@Context({ validator: 'graphql', type: 'object' })
export class DictionaryLangEntityObjectGQL extends DictionaryLangEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class DictionaryLangEntityArgsGQL extends DictionaryLangEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class DictionaryLangEntityInputGQL extends DictionaryLangEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class DictionaryLangEntityCV extends DictionaryLangEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class DictionaryLangEntityMongo extends DictionaryLangEntityFactory({
  validator: 'mongodb',
}) {}

export const DictionaryLangEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => DictionaryLangEntityArgsGQL,
    object: () => DictionaryLangEntityObjectGQL,
    input: () => DictionaryLangEntityInputGQL,
  },
  class_validator: () => DictionaryLangEntityCV,
  mongodb: () => DictionaryLangEntityMongo,
};

export type DictionaryLangEntityType = DictionaryLangEntityCV;
