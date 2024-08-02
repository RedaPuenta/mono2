import { registerEnumType } from '@nestjs/graphql';

export enum AccountStepEnum {
  PASSWORD_CHANGE_REQUESTED = 'PASSWORD_CHANGE_REQUESTED',
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
}

registerEnumType(AccountStepEnum, {
  name: 'AccountStepEnum',
});
