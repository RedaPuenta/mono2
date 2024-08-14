import { DateTime } from '@lib/scalars';
import {
  ArgsType,
  Field,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import {
  ControlCameraEventEntityArgsGQL,
  PaginationParamsGenericArgsGQL,
  PagingGeneric,
} from 'libs/data';
import { StringValidator } from '@lib/decorators';
import { ControlCameraEventEntity } from '../entities/camera-event.entity';

@ObjectType()
export class SearchControlCameraEventResponseDto extends PagingGeneric<ControlCameraEventEntity>(
  {
    validator: 'graphql',
    type: 'object',
    entity: ControlCameraEventEntity,
  },
) {}

@ArgsType()
export class SearchControlCameraEventDto extends IntersectionType(
  PaginationParamsGenericArgsGQL,
  PartialType(
    PickType(ControlCameraEventEntityArgsGQL, [
      'way',
      'knownLpn',
      'cameraId',
      'isVehicle',
    ] as const),
  ),
) {
  @StringValidator({
    context: {
      validator: 'graphql',
      type: 'args',
    },
    required: true,
    special: {
      type: 'mongoId',
    },
  })
  upsId!: string;

  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  lpnLike?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsDateString()
  @Field(() => DateTime, { nullable: true })
  startDate?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsDateString()
  @Field(() => DateTime, { nullable: true })
  endDate?: string | null;
}
