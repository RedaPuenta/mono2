import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { Camera } from '../entites/camera.entity';

export class ReadCameraDto extends PartialType(
  PickType(Camera, ['code'] as const),
) {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  cameraId?: string;
}
