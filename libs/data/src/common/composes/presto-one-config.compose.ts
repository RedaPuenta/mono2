import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  UnknownValidator,
} from '@lib/decorators';

export const PrestoOneConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PrestoOne {
    @UnknownValidator({
      context,
      required: false,
    })
    config?: unknown | null;

    @UnknownValidator({
      context,
      required: false,
    })
    gui?: unknown | null;

    @UnknownValidator({
      context,
      required: false,
    })
    tickets?: unknown | null;

    @UnknownValidator({
      context,
      required: false,
    })
    wizards?: unknown | null;

    @UnknownValidator({
      context,
      required: false,
    })
    translations?: unknown | null;

    @ArrayValidator({
      context,
      required: false,
      entity: () => String as any,
    })
    tariffs?: Array<string> | null;
  }

  return PrestoOne;
};

@Context({ validator: 'graphql', type: 'object' })
export class PrestoOneComposeObjectGQL extends PrestoOneConfigComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class PrestoOneComposeArgsGQL extends PrestoOneConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class PrestoOneComposeInputGQL extends PrestoOneConfigComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class PrestoOneComposeCV extends PrestoOneConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class PrestoOneComposeMongo extends PrestoOneConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const PrestoOneConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => PrestoOneComposeArgsGQL,
    object: () => PrestoOneComposeObjectGQL,
    input: () => PrestoOneComposeInputGQL,
  },
  class_validator: () => PrestoOneComposeCV,
  mongodb: () => PrestoOneComposeMongo,
};

export type PrestoOneConfigComposeType = PrestoOneComposeCV;
