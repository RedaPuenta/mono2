import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

@ArgsType()
export class UpdateUPSOccupancyDto {
  @Field(() => String)
  @ApiProperty({ type: String })
  @IsMongoId()
  upsId!: string;

  @Field(() => Number)
  @ApiProperty({ type: Number })
  delta!: number;
}
