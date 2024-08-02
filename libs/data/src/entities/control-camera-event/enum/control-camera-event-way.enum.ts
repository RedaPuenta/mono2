import { registerEnumType } from '@nestjs/graphql';

export enum ControlCameraEventWayEnum {
  entry = 'entry',
  exit = 'exit',
  unknown = 'unknown',
}

registerEnumType(ControlCameraEventWayEnum, {
  name: 'ControlCameraEventWayEnum',
});
