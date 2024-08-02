import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CameraEvent } from '../schemas/camera-events.schema';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateCameraEventDto extends PartialType(
  PickType(CameraEvent, [
    'cameraId',
    'way',
    'confidence',
    'vehicle',
    'isVehicle',
    'knownLpn',
    'hasParkingRight',
    'resources',
    'happenedAt',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  cameraEventId!: string;
}
