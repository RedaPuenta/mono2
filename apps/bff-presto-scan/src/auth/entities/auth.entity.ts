import { Field, ObjectType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';

@ObjectType()
export class AuthEntity {
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  token?: string;

  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  status?: string;

  @ApiPropertyOptional({ type: [String] })
  @Field((type) => [String], { nullable: true })
  validationSteps?: [string];
}
