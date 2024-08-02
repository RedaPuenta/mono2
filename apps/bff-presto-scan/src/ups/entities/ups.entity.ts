import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpsEntityObjectGQL } from 'libs/data';

@ObjectType()
export class Location {
  @ApiProperty({ type: Number })
  @Field()
  latitude!: number;

  @Field()
  @ApiProperty({ type: Number })
  longitude!: number;

  @Field()
  @ApiProperty({ type: Number })
  altitude!: number;

  @Field()
  @ApiProperty({ type: Number })
  incertitude!: number;
}

@ObjectType()
export class Payload {
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  tariffId?: string | null;

  @ApiPropertyOptional({ type: Number })
  @Field(() => Int, { nullable: true })
  duree_fps?: number | null;

  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  pointOfSaleId?: string | null;

  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  legacyId?: string | null;
}

@ObjectType()
export class UpsEntity extends OmitType(UpsEntityObjectGQL, [
  'payload',
] as const) {
  //: API
  @ApiPropertyOptional({ type: Location })
  @Field(() => Location, { nullable: true })
  location?: Location | null;

  //: API
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  groupId?: String | null;

  //* Unknown in BDD
  @Field(() => Payload, { nullable: true })
  @ApiPropertyOptional({ type: Payload })
  payload?: Payload | null;
}
