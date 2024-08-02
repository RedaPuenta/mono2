import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Camera } from '../entites/camera.entity';

export class UpdateCameraDto extends PartialType(
  PickType(Camera, ['code', 'position', 'ups', 'description'] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  cameraId!: string;
}
