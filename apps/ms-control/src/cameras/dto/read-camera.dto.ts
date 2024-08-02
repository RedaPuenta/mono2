import { PartialType, PickType } from '@nestjs/swagger';
import { Camera } from '../schemas/camera.schema';


export class ReadCameraDto extends PartialType(
  PickType(Camera, ['code', 'position', 'ups', 'description'] as const),
) {}
