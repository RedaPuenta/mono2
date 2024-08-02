import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthEntity } from '../entities/auth.entity';
import { ControlUserAuthEntity } from '../entities/control-user.entity';

@ArgsType()
export class LoginDto {
  @ApiProperty({ type: String })
  @Field(() => String)
  @IsEmail()
  username!: string;

  @ApiProperty({ type: String })
  @Field()
  password!: string;
}

@ObjectType()
export class LoginResponseDto {
  @ApiProperty({ type: AuthEntity })
  @Field()
  auth!: AuthEntity;

  @ApiProperty({ type: ControlUserAuthEntity })
  @Field()
  user!: ControlUserAuthEntity;
}
