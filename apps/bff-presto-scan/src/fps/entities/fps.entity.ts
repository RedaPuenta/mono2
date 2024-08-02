import { FpsEntityObjectGQL } from '@lib/data';
import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { PictureComposeObjectGQL } from '../../common/compose/picture';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class FpsEntityPicture extends PickType(PictureComposeObjectGQL, [
  'pictureName',
  'description',
  'pictureDatetime',
  'contentURL',
] as const) {}

@ObjectType()
export class FpsEntity extends FpsEntityObjectGQL {
  //: API
  @Field(() => String)
  @ApiProperty({ type: String })
  class!: string;

  //: API
  @Field(() => [FpsEntityPicture])
  @ApiProperty({ type: [FpsEntityPicture] })
  pictures!: FpsEntityPicture[];
}
