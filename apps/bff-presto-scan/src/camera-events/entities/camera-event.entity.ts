import { ControlCameraEventEntityObjectGQL } from '@lib/data';
import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { ControlCameraEntity } from '../../cameras/entities/camera.entity';
import { SearchResourceResponseDto } from '../../resources/dto/search-resources.dto';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ControlCameraEventEntity extends OmitType(
  ControlCameraEventEntityObjectGQL,
  ['resources'] as const,
) {
  //! Resolver GQL
  @ApiProperty({ type: ControlCameraEntity })
  @Field(() => ControlCameraEntity)
  camera!: ControlCameraEntity;

  //! Resolver GQL
  @ApiProperty({ type: SearchResourceResponseDto })
  @Field(() => SearchResourceResponseDto)
  resources!: SearchResourceResponseDto;

  //: API
  @ApiProperty({ type: Boolean })
  @Field(() => Boolean)
  isAnonymised!: boolean;
}
