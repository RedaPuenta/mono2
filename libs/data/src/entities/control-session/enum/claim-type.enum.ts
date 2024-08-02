import { registerEnumType } from '@nestjs/graphql';

export enum ClaimTypeEnum {
  PRELIMINARY = 'PRELIMINARY',
  REGULATORY = 'REGULATORY',
}

registerEnumType(ClaimTypeEnum, {
  name: 'ClaimTypeEnum',
});
