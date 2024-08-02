import { registerEnumType } from '@nestjs/graphql';

export enum NotificationAuthorityEnum {
  LOCAL = 'LOCAL',
  ANTAI = 'ANTAI',
}

registerEnumType(NotificationAuthorityEnum, {
  name: 'NotificationAuthorityEnum',
});
