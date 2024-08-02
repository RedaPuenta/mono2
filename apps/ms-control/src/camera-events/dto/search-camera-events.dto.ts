import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';
import { PaginationParamsGenericCV, PagingGeneric } from 'libs/data';
import { CameraEvent } from '../schemas/camera-events.schema';

export class SearchCameraEventResponseDto extends PagingGeneric<CameraEvent>({
  validator: 'class_validator',
  entity: CameraEvent,
}) {}

export class SearchCameraEventDto extends IntersectionType(
  PartialType(PaginationParamsGenericCV),
  PartialType(
    PickType(CameraEvent, [
      'confidence',
      'way',
      'happenedAt',
      'vehicle',
      'resources',
      'isVehicle',
      'knownLpn',
    ] as const),
  ),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  cameraId!: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  startDate?: Date | string | null;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  endDate?: Date | string | null;
}
