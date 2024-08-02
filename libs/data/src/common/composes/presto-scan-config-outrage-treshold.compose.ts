import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
} from '@lib/decorators';

export const PrestoScanConfigOutrageTresholdComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PrestoScanConfigOutrageTreshold {
    @NumberValidator({
      context,
      required: true,
    })
    danger!: number;

    @NumberValidator({
      context,
      required: true,
    })
    warning!: number;

    @NumberValidator({
      context,
      required: true,
    })
    valid!: number;
  }

  return PrestoScanConfigOutrageTreshold;
};

@Context({ validator: 'graphql', type: 'object' })
export class PrestoScanConfigOutrageTresholdComposeObjectGQL extends PrestoScanConfigOutrageTresholdComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class PrestoScanConfigOutrageTresholdComposeArgsGQL extends PrestoScanConfigOutrageTresholdComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class PrestoScanConfigOutrageTresholdComposeInputGQL extends PrestoScanConfigOutrageTresholdComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class PrestoScanConfigOutrageTresholdComposeCV extends PrestoScanConfigOutrageTresholdComposeFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class PrestoScanConfigOutrageTresholdComposeMongo extends PrestoScanConfigOutrageTresholdComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const PrestoScanConfigOutrageTresholdComposeRule: EntityValidatorType.EntityPanel =
  {
    graphql: {
      args: () => PrestoScanConfigOutrageTresholdComposeArgsGQL,
      object: () => PrestoScanConfigOutrageTresholdComposeObjectGQL,
      input: () => PrestoScanConfigOutrageTresholdComposeInputGQL,
    },
    class_validator: () => PrestoScanConfigOutrageTresholdComposeCV,
    mongodb: () => PrestoScanConfigOutrageTresholdComposeMongo,
  };

export type PrestoScanConfigOutrageTresholdComposeType =
  PrestoScanConfigOutrageTresholdComposeCV;
