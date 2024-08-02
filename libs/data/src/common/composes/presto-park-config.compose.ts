import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const PrestoParkConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PrestoParkConfig {
    @StringValidator({
      context,
      required: true,
    })
    cityId!: string;
  }

  return PrestoParkConfig;
};

@Context({ validator: 'graphql', type: 'object' })
export class PrestoParkConfigComposeObjectGQL extends PrestoParkConfigComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class PrestoParkConfigComposeArgsGQL extends PrestoParkConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class PrestoParkConfigComposeInputGQL extends PrestoParkConfigComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class PrestoParkConfigComposeCV extends PrestoParkConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class PrestoParkConfigComposeMongo extends PrestoParkConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const PrestoParkConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => PrestoParkConfigComposeArgsGQL,
    object: () => PrestoParkConfigComposeObjectGQL,
    input: () => PrestoParkConfigComposeInputGQL,
  },
  class_validator: () => PrestoParkConfigComposeCV,
  mongodb: () => PrestoParkConfigComposeMongo,
};

export type PrestoParkConfigComposeType = PrestoParkConfigComposeCV;
