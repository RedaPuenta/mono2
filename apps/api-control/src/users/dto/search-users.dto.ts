import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import {
  AccountStateEnum,
  PaginationParamsGenericCV,
  PagingGeneric,
} from '@lib/data';
import { ControlUser } from '../entities/controlUser.entity';

export class SearchControlUserResponseDto extends PagingGeneric<ControlUser>({
  validator: 'class_validator',
  entity: ControlUser,
}) {}

export class SearchControlUserDto extends IntersectionType(
  PaginationParamsGenericCV,
  PartialType(
    PickType(ControlUser, [
      '_id',
      'username',
      'accountId',
      'createdAt',
      'updatedAt',
      'firstName',
      'lastName',
    ] as const),
  ),
) {
  @ApiPropertyOptional({ type: String, enum: AccountStateEnum })
  @IsOptional()
  @IsEnum(AccountStateEnum)
  state?: AccountStateEnum | null;
}
