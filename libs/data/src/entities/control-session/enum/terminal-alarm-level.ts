import { registerEnumType } from '@nestjs/graphql';

export enum TerminalAlarmLevelEnum {
  INFORMATION = 'INFORMATION',
  INTERVENTION_REQUEST = 'INTERVENTION_REQUEST',
  RESTRICTED_MODE = 'RESTRICTED_MODE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}

registerEnumType(TerminalAlarmLevelEnum, {
  name: 'TerminalAlarmLevelEnum',
});
