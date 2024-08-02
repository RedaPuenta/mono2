import { registerEnumType } from '@nestjs/graphql';

export enum ClaimStatusEnum {
  FILLED = 'FILLED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  TRANSFERRED = 'TRANSFERRED',
}

registerEnumType(ClaimStatusEnum, {
  name: 'ClaimStatusEnum',
});
