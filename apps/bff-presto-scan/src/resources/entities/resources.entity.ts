import { ResourceEntityObjectGQL } from '@lib/data';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

@ObjectType()
export class ResourcesEntity extends ResourceEntityObjectGQL {
  //: API
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ type: String })
  @IsDateString()
  stopDate?: string | null;
}
