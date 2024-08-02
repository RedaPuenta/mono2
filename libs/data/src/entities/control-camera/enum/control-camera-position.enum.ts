import { registerEnumType } from '@nestjs/graphql';

export enum ControlCameraPositionEnum {
  inside = 'inside',
  outside = 'outside',
}

registerEnumType(ControlCameraPositionEnum, {
  name: 'ControlCameraPositionEnum',
});
