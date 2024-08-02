import {
  BooleanValidator,
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
} from '@lib/decorators';
import {
  PrestoScanConfigDeletionDelayComposeRule,
  PrestoScanConfigDeletionDelayComposeType,
} from './presto-scan-config-deletion-delay.compose';
import {
  PrestoScanConfigOutrageTresholdComposeRule,
  PrestoScanConfigOutrageTresholdComposeType,
} from './presto-scan-config-outrage-treshold.compose';

export const PrestoScanConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PrestoScanConfig {
    @NumberValidator({
      context,
      required: true,
    })
    entryTolerancePeriod!: number;

    @NumberValidator({
      context,
      required: true,
    })
    exitTolerancePeriod!: number;

    @BooleanValidator({
      context,
      required: true,
    })
    isVerbalizationAllowed!: boolean;

    @BooleanValidator({
      context,
      required: true,
    })
    showOccupancy!: boolean;

    @EntityValidator({
      context,
      required: true,
      entity: PrestoScanConfigDeletionDelayComposeRule,
    })
    deletionDelay!: PrestoScanConfigDeletionDelayComposeType;

    @EntityValidator({
      context,
      required: true,
      entity: PrestoScanConfigOutrageTresholdComposeRule,
    })
    outrageTreshold!: PrestoScanConfigOutrageTresholdComposeType;
  }

  return PrestoScanConfig;
};

@Context({ validator: 'graphql', type: 'object' })
export class PrestoScanConfigComposeObjectGQL extends PrestoScanConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class PrestoScanConfigComposeArgsGQL extends PrestoScanConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class PrestoScanConfigComposeInputGQL extends PrestoScanConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class PrestoScanConfigComposeCV extends PrestoScanConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class PrestoScanConfigComposeMongo extends PrestoScanConfigComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const PrestoScanConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => PrestoScanConfigComposeArgsGQL,
    object: () => PrestoScanConfigComposeObjectGQL,
    input: () => PrestoScanConfigComposeInputGQL,
  },
  class_validator: () => PrestoScanConfigComposeCV,
  mongodb: () => PrestoScanConfigComposeMongo,
};

export type PrestoScanConfigComposeType = PrestoScanConfigComposeCV;
