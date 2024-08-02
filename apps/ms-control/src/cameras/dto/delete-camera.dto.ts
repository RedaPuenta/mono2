import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteCameraDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  cameraId!: string;
}
