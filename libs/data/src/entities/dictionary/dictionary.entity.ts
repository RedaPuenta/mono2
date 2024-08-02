import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';
import {
  DictionaryLangEntityRule,
  DictionaryLangEntityType,
} from '../dictionary-lang/dictionary-lang.entity';

export const DictionaryEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class Dictionary extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      unique: true,
      index: true,
    })
    key!: string;

    @ArrayValidator({
      context,
      required: true,
      entity: () => String as any,
    })
    languages!: Array<String>;

    @ArrayValidator({
      context,
      required: true,
      entity: DictionaryLangEntityRule,
      ref: 'DictionaryLang',
    })
    documents!: Array<DictionaryLangEntityType>;
  }

  return Dictionary;
};

@Context({ validator: 'graphql', type: 'object' })
export class DictionaryEntityObjectGQL extends DictionaryEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class DictionaryEntityArgsGQL extends DictionaryEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class DictionaryEntityInputGQL extends DictionaryEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class DictionaryEntityCV extends DictionaryEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class DictionaryEntityMongo extends DictionaryEntityFactory({
  validator: 'mongodb',
}) {}

export const dictionaryEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => DictionaryEntityArgsGQL,
    object: () => DictionaryEntityObjectGQL,
    input: () => DictionaryEntityInputGQL,
  },
  class_validator: () => DictionaryEntityCV,
  mongodb: () => DictionaryEntityMongo,
};

export type DictionaryEntityType = DictionaryEntityCV;
