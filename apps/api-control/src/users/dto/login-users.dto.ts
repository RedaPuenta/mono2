import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { ControlUser } from '../entities/controlUser.entity';

export class LoginUsersDto {
  @ApiProperty({ type: String })
  @IsString()
  consumer!: string;

  @ApiProperty({ type: String })
  @IsEmail()
  username!: string;

  @ApiProperty({ type: String })
  @IsString()
  password!: string;

  @ApiProperty({ type: String })
  @IsString()
  type!: string;
}

export class LoginUsersResponseDto {
  @ApiProperty({ type: ControlUser })
  user!: ControlUser;

  @ApiProperty({ type: String })
  status!: string;

  @ApiProperty({ type: [String] })
  validationSteps!: [string];
}
