import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Camera } from '../schemas/camera.schema';

export class UpdateCameraDto extends PartialType(
  PickType(Camera, [
    'code',
    'position',
    'position',
    'ups',
    'description',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  cameraId!: string;
}
