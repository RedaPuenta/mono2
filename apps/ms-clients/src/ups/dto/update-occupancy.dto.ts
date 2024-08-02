import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNumber } from 'class-validator';
import { Ups } from '../schemas/ups.schema';

export class UpdateOccupancyDto extends PartialType(
  PickType(Ups, [] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  upsId!: string;

  @IsNumber()
  @ApiProperty({ type: Number })
  delta!: number;
}
