import { PartialType, PickType } from '@nestjs/swagger';
import { ControlSession } from '../entities/controlSession.entity';

export class UpdateSessionDto extends PartialType(
  PickType(ControlSession, ['_id', 'controlState'] as const),
) {}
