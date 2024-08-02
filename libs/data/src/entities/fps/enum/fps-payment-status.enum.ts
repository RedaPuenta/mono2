import { registerEnumType } from '@nestjs/graphql';

export enum FPSPaymentStatusEnum {
  PENDING = 'PENDING',
  OVERPAID = 'OVERPAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

registerEnumType(FPSPaymentStatusEnum, {
  name: 'FPSPaymentStatusEnum',
});
