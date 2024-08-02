import { PaginationParamsGenericCV, PagingGeneric } from '@lib/data';
import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { CameraEvent } from '../entities/camera-event';

export class SearchCameraEventDto extends IntersectionType(
  PaginationParamsGenericCV,
  PartialType(
    PickType(CameraEvent, [
      'way',
      'confidence',
      'happenedAt',
      'vehicle',
      'isVehicle',
      'vehicle',
      'knownLpn',
      'resources',
    ] as const),
  ),
) {
  @IsMongoId()
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  cameraId!: string;
}

export class SearchCameraEventResponseDto extends PagingGeneric<CameraEvent>({
  validator: 'class_validator',
  entity: CameraEvent,
}) {}
