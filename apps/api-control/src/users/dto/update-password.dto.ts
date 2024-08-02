import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string;

  @ApiProperty({ type: String })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ type: String })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword!: string;
}

export class UpdatePasswordResponseDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success!: boolean;
}
