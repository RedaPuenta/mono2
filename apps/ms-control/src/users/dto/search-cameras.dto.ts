import { PaginationParamsGenericCV, PagingGeneric } from '@lib/data';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { ControlUser } from '../schemas/control-user.schema';

export class SearchControlUserResponseDto extends PagingGeneric<ControlUser>({
  validator: 'class_validator',
  entity: ControlUser,
}) {}

export class SearchControlUserDto extends IntersectionType(
  PartialType(PaginationParamsGenericCV),
  PartialType(PickType(ControlUser, [] as const)),
) {}
