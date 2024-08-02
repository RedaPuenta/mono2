import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
} from '@lib/decorators';

export const StatementLocationComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class StatementLocation {
    @NumberValidator({
      context,
      required: false,
    })
    latitude?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    longitude?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    altitude?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    incertitude?: number | null;
  }

  return StatementLocation;
};

@Context({ validator: 'graphql', type: 'object' })
export class StatementLocationComposeObjectGQL extends StatementLocationComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class StatementLocationComposeArgsGQL extends StatementLocationComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class StatementLocationComposeInputGQL extends StatementLocationComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class StatementLocationComposeCV extends StatementLocationComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class StatementLocationComposeMongo extends StatementLocationComposeFactory({
  validator: 'mongodb',
}) {}

export const StatementLocationComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => StatementLocationComposeArgsGQL,
    object: () => StatementLocationComposeObjectGQL,
    input: () => StatementLocationComposeInputGQL,
  },
  class_validator: () => StatementLocationComposeCV,
  mongodb: () => StatementLocationComposeMongo,
};

export type StatementLocationComposeType = StatementLocationComposeCV;
