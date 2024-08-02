import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class UpdatePasswordResponseDto {
  @Field((type) => Boolean)
  @ApiProperty({ type: Boolean })
  success!: boolean;
}
