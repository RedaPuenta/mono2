import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

@InputType()
export class UpdatePasswordDto {
  @Field((type) => String)
  @ApiProperty({ type: String })
  currentPassword!: string;

  @Field((type) => String)
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
