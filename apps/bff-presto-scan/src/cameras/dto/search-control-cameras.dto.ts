import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

@ArgsType()
export class SearchControlCamerasDto {
  @Field()
  @ApiProperty({ type: String })
  @IsMongoId()
  upsId!: string;
}
