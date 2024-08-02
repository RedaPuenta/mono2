import {
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { TerminalAlarmLevelEnum } from '../enum/terminal-alarm-level';
import { TerminalAlarmNameEnum } from '../enum/terminal-alarm-name';

export const TerminalAlarmComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class TerminalAlarm {
    @StringValidator({
      context,
      required: true,
      enumeration: TerminalAlarmLevelEnum,
    })
    level!: TerminalAlarmLevelEnum;

    @StringValidator({
      context,
      required: true,
      enumeration: TerminalAlarmNameEnum,
    })
    name!: TerminalAlarmNameEnum;

    @DateValidator({
      context,
      required: true,
    })
    startDate!: string;

    @DateValidator({
      context,
      required: true,
    })
    endDate!: string;
  }

  return TerminalAlarm;
};

@Context({ validator: 'graphql', type: 'object' })
export class TerminalAlarmComposeObjectGQL extends TerminalAlarmComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class TerminalAlarmComposeArgsGQL extends TerminalAlarmComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class TerminalAlarmComposeInputGQL extends TerminalAlarmComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class TerminalAlarmComposeCV extends TerminalAlarmComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class TerminalAlarmComposeMongo extends TerminalAlarmComposeFactory({
  validator: 'mongodb',
}) {}

export const TerminalAlarmComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => TerminalAlarmComposeArgsGQL,
    object: () => TerminalAlarmComposeObjectGQL,
    input: () => TerminalAlarmComposeInputGQL,
  },
  class_validator: () => TerminalAlarmComposeCV,
  mongodb: () => TerminalAlarmComposeMongo,
};

export type TerminalAlarmComposeType = TerminalAlarmComposeCV;
