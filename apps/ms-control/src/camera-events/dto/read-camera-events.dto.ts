import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { CameraEvent } from '../schemas/camera-events.schema';

export class ReadCameraEventDto extends PartialType(
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
