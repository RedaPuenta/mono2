import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import {
  TerminalHealthComposeRule,
  TerminalHealthComposeType,
} from './terminal-health.compose';

export const HealthSummaryComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class HealthSummary {
    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    upsId!: string;

    @ArrayValidator({
      context,
      required: false,
      entity: TerminalHealthComposeRule,
    })
    terminalsHealth?: Array<TerminalHealthComposeType> | null;
  }

  return HealthSummary;
};

@Context({ validator: 'graphql', type: 'object' })
export class HealthSummaryComposeObjectGQL extends HealthSummaryComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class HealthSummaryComposeArgsGQL extends HealthSummaryComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class HealthSummaryComposeInputGQL extends HealthSummaryComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class HealthSummaryComposeCV extends HealthSummaryComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class HealthSummaryComposeMongo extends HealthSummaryComposeFactory({
  validator: 'mongodb',
}) {}

export const HealthSummaryComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => HealthSummaryComposeArgsGQL,
    object: () => HealthSummaryComposeObjectGQL,
    input: () => HealthSummaryComposeInputGQL,
  },
  class_validator: () => HealthSummaryComposeCV,
  mongodb: () => HealthSummaryComposeMongo,
};

export type HealthSummaryComposeType = HealthSummaryComposeCV;
