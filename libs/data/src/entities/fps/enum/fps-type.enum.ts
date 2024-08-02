import { registerEnumType } from '@nestjs/graphql';

export enum FPSTypeEnum {
  INITIAL = 'INITIAL',
  CORRECTION = 'CORRECTION',
  CANCELLED = 'CANCELLED',
}

registerEnumType(FPSTypeEnum, {
  name: 'FPSTypeEnum',
});
