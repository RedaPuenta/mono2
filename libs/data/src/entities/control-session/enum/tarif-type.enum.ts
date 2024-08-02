import { registerEnumType } from '@nestjs/graphql';

export enum TarifTypeEnum {
  SHORT_TERM = 'SHORT_TERM',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FINE = 'FINE',
  FREE_PERIOD = 'FREE_PERIOD',
}

registerEnumType(TarifTypeEnum, {
  name: 'TarifTypeEnum',
});
