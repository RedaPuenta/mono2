import { PaginationParamsGenericCV, PagingGeneric } from '@lib/data';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Camera } from '../schemas/camera.schema';

export class SearchCameraResponseDto extends PagingGeneric<Camera>({
  validator: 'class_validator',
  entity: Camera,
}) {}

export class SearchCameraDto extends IntersectionType(
  PaginationParamsGenericCV,
  PartialType(
    PickType(Camera, ['code', 'position', 'ups', 'description'] as const),
  ),
) {}
