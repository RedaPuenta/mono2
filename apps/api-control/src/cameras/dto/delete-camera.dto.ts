import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteCameraDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  cameraId!: string;
}
