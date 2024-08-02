import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { ControlSessionEntityInputGQL } from 'libs/data';

@InputType()
export class UpdateControlSessionsDto extends PartialType(
  PickType(ControlSessionEntityInputGQL, ['controlState'] as const),
) {}
