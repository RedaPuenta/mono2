import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { PmsTechnicalUser } from '../schemas/pms-technical-user.schema';

export class UpdateUserDto extends PartialType(
  PickType(PmsTechnicalUser, [
    'username',
    'lastName',
    'firstName',
    'phone',
    'lang',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  userId!: string;
}
