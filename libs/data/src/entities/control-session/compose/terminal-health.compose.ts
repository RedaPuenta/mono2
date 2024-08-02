import {
  ArrayValidator,
  BooleanValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import {
  TerminalAlarmComposeRule,
  TerminalAlarmComposeType,
} from './terminal-alarm.compose';

export const TerminalHealthComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class TerminalHealth {
    @NumberValidator({
      context,
      required: true,
    })
    terminalId!: number;

    @StringValidator({
      context,
      required: true,
    })
    terminalName!: string;

    @BooleanValidator({
      context,
      required: true,
    })
    alive!: boolean;

    @ArrayValidator({
      context,
      required: false,
      entity: TerminalAlarmComposeRule,
    })
    alarms?: Array<TerminalAlarmComposeType> | null;
  }

  return TerminalHealth;
};

@Context({ validator: 'graphql', type: 'object' })
export class TerminalHealthComposeObjectGQL extends TerminalHealthComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class TerminalHealthComposeArgsGQL extends TerminalHealthComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class TerminalHealthComposeInputGQL extends TerminalHealthComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class TerminalHealthComposeCV extends TerminalHealthComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class TerminalHealthComposeMongo extends TerminalHealthComposeFactory({
  validator: 'mongodb',
}) {}

export const TerminalHealthComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => TerminalHealthComposeArgsGQL,
    object: () => TerminalHealthComposeObjectGQL,
    input: () => TerminalHealthComposeInputGQL,
  },
  class_validator: () => TerminalHealthComposeCV,
  mongodb: () => TerminalHealthComposeMongo,
};

export type TerminalHealthComposeType = TerminalHealthComposeCV;
