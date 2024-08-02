import { ControlUserEntityObjectGQL } from '@lib/data';
import { ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class ControlUserAuthEntity extends PickType(
  ControlUserEntityObjectGQL,
  ['_id', 'firstName', 'lastName'] as const,
) {}
