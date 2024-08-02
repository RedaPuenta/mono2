import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsStrongPassword } from 'class-validator';
import { ControlUser } from '../entities/controlUser.entity';

export class UpdateControlUserDto extends PartialType(
  PickType(ControlUser, [
    'firstName',
    'lastName',
    'username',
    'lang',
    'fpsAgentId',
    'fpsAgentName',
    'ups',
  ] as const),
) {
  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password?: string;
}
