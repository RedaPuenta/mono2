import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, ValidateNested } from 'class-validator';
import { CameraEvent } from '../entities/camera-event';

export class ReadCameraEventDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  cameraEventId!: string;
}
