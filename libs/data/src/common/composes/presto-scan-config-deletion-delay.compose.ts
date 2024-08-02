import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
} from '@lib/decorators';

export const PrestoScanConfigDeletionDelayComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PrestoScanConfigDeletionDelay {
    @NumberValidator({
      context,
      required: true,
    })
    incomplete!: number;

    @NumberValidator({
      context,
      required: true,
    })
    complete!: number;

    @NumberValidator({
      context,
      required: true,
    })
    toCheck!: number;

    @NumberValidator({
      context,
      required: true,
    })
    unfined!: number;

    @NumberValidator({
      context,
      required: true,
    })
    fined!: number;
  }

  return PrestoScanConfigDeletionDelay;
};

@Context({ validator: 'graphql', type: 'object' })
export class PrestoScanConfigDeletionDelayComposeObjectGQL extends PrestoScanConfigDeletionDelayComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class PrestoScanConfigDeletionDelayComposeArgsGQL extends PrestoScanConfigDeletionDelayComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class PrestoScanConfigDeletionDelayComposeInputGQL extends PrestoScanConfigDeletionDelayComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class PrestoScanConfigDeletionDelayComposeCV extends PrestoScanConfigDeletionDelayComposeFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class PrestoScanConfigDeletionDelayComposeMongo extends PrestoScanConfigDeletionDelayComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const PrestoScanConfigDeletionDelayComposeRule: EntityValidatorType.EntityPanel =
  {
    graphql: {
      args: () => PrestoScanConfigDeletionDelayComposeArgsGQL,
      object: () => PrestoScanConfigDeletionDelayComposeObjectGQL,
      input: () => PrestoScanConfigDeletionDelayComposeInputGQL,
    },
    class_validator: () => PrestoScanConfigDeletionDelayComposeCV,
    mongodb: () => PrestoScanConfigDeletionDelayComposeMongo,
  };

export type PrestoScanConfigDeletionDelayComposeType =
  PrestoScanConfigDeletionDelayComposeCV;
