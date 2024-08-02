import { ControlCameraEntityObjectGQL } from '@lib/data';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ControlCameraEntity extends ControlCameraEntityObjectGQL {}
