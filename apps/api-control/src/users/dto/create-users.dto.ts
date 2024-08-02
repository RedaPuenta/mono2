import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
  IsStrongPassword,
  isStrongPassword,
} from 'class-validator';
import { ControlUser } from '../entities/controlUser.entity';

export class CreateUsersDto extends PickType(ControlUser, [
  'username',
  'accountId',
  'lastName',
  'firstName',
  'lang',
  'fpsAgentId',
  'fpsAgentName',
] as const) {
  @ApiProperty({ type: String })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  upsId!: string;
}
