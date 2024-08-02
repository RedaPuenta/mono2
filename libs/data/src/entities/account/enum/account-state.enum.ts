import { registerEnumType } from '@nestjs/graphql';

export enum AccountStateEnum {
  UNVERIFIED = 'UNVERIFIED',
  TO_VERIFY = 'TO_VERIFY',
  VERIFIED = 'VERIFIED',
}

registerEnumType(AccountStateEnum, {
  name: 'AccountStateEnum',
});
