import { PaginationParamsGenericCV, PagingGeneric } from '@lib/data';
import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Camera } from '../entites/camera.entity';

export class SearchCameraResponseDto extends PagingGeneric<Camera>({
  validator: 'class_validator',
  entity: Camera,
}) {}

export class SearchCameraDto extends IntersectionType(
  PaginationParamsGenericCV,
  PartialType(PickType(Camera, ['code', 'ups'] as const)),
) {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  cameraIds?: string[];
}
