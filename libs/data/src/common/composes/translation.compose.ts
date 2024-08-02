import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
  UnknownValidator,
} from '@lib/decorators';

export const TranslationComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class Translation {
    @StringValidator({
      context,
      required: true,
    })
    lang!: string;

    @StringValidator({
      context,
      required: true,
    })
    name!: string;

    @StringValidator({
      context,
      required: false,
    })
    description?: string | null;
  }

  return Translation;
};

@Context({ validator: 'graphql', type: 'object' })
export class TranslationComposeObjectCGQL extends TranslationComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class TranslationComposeArgsGQL extends TranslationComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class TranslationComposeInputGQL extends TranslationComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class TranslationComposeCV extends TranslationComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class TranslationComposeMongo extends TranslationComposeFactory({
  validator: 'mongodb',
}) {}

export const TranslationComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => TranslationComposeArgsGQL,
    object: () => TranslationComposeObjectCGQL,
    input: () => TranslationComposeInputGQL,
  },
  class_validator: () => TranslationComposeCV,
  mongodb: () => TranslationComposeMongo,
};

export type TranslationComposeType = TranslationComposeCV;
