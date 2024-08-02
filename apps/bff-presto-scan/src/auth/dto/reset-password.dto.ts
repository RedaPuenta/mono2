import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthEntity } from '../entities/auth.entity';
import { ControlUserAuthEntity } from '../entities/control-user.entity';

@ArgsType()
export class ResetPasswordDto {
  @ApiProperty({ type: String })
  @Field()
  @IsEmail()
  username!: string;

  @ApiProperty({ type: String })
  @Field()
  currentPassword!: string;

  @ApiProperty({ type: String })
  @Field()
  newPassword!: string;
}

@ObjectType()
export class ResetPasswordResponseDto {
  @ApiProperty({ type: AuthEntity })
  @Field()
  auth!: AuthEntity;

  @ApiProperty({ type: ControlUserAuthEntity })
  @Field()
  user!: ControlUserAuthEntity;
}
