import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
} from '@lib/decorators';

export const OnstreetConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class OnstreetConfig {
    @NumberValidator({
      context,
      required: true,
    })
    maximumDuration!: number;

    @NumberValidator({
      context,
      required: true,
    })
    maximumAmount!: number;
  }

  return OnstreetConfig;
};

@Context({ validator: 'graphql', type: 'object' })
export class OnstreetConfigComposeObjectGQL extends OnstreetConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class OnstreetConfigComposeArgsGQL extends OnstreetConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class OnstreetConfigComposeInputGQL extends OnstreetConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class OnstreetConfigComposeCV extends OnstreetConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class OnstreetConfigComposeMongo extends OnstreetConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const OnstreetConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => OnstreetConfigComposeArgsGQL,
    object: () => OnstreetConfigComposeObjectGQL,
    input: () => OnstreetConfigComposeInputGQL,
  },
  class_validator: () => OnstreetConfigComposeCV,
  mongodb: () => OnstreetConfigComposeMongo,
};

export type OnstreetConfigComposeType = OnstreetConfigComposeCV;
