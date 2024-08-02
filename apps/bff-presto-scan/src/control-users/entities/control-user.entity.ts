import { ControlUserEntityObjectGQL } from '@lib/data';
import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UpsEntity } from '../../ups/entities/ups.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ObjectType()
export class ControlUserEntity extends OmitType(ControlUserEntityObjectGQL, [
  'ups',
] as const) {
  //: API
  @Field({ nullable: true })
  @ApiProperty({ type: String })
  state!: string;

  //! Resolver GQL
  @Field(() => [UpsEntity], { nullable: true })
  @ApiPropertyOptional({ type: [UpsEntity] })
  ups?: Array<UpsEntity> | null;
}
