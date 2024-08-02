import { PaginationParamsGenericCV, PagingGeneric } from '@lib/data';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PmsTechnicalUser } from '../schemas/pms-technical-user.schema';

export class SearchUserResponseDto extends PagingGeneric<PmsTechnicalUser>({
  validator: 'class_validator',
  entity: PmsTechnicalUser,
}) {}

export class SearchUserDto extends IntersectionType(
  PaginationParamsGenericCV,
  PartialType(PickType(PmsTechnicalUser, [] as const)),
) {}
