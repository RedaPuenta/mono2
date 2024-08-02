import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { PmsTechnicalUser } from '../schemas/pms-technical-user.schema';

export class ReadUserDto extends PartialType(
  PickType(PmsTechnicalUser, [] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  userId!: string;
}
