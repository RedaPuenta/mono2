import { registerEnumType } from '@nestjs/graphql';

export enum ControlCameraStateEnum {
  UNDEFINED = 'UNDEFINED',
  TO_CONTROL = 'TO_CONTROL',
  FINED = 'FINED',
  NOT_FINED = 'NOT_FINED',
  ERROR = 'ERROR',
  OK = 'OK',
}

registerEnumType(ControlCameraStateEnum, {
  name: 'ControlCameraStateEnum',
});
