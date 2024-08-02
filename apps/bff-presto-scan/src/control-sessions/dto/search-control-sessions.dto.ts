import {
  ArgsType,
  Field,
  Int,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import {
  ControlSessionEntityArgsGQL,
  PaginationParamsGenericArgsGQL,
  PagingGeneric,
} from 'libs/data';
import { ControlSessionEntity } from '../entities/control-session.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ObjectType()
export class SearchControlSessionResponseDto extends PagingGeneric<ControlSessionEntity>(
  {
    validator: 'graphql',
    type: 'object',
    entity: ControlSessionEntity,
  },
) {}

@ArgsType()
export class SearchControlSessionDto extends IntersectionType(
  PaginationParamsGenericArgsGQL,
  IntersectionType(
    PartialType(
      PickType(ControlSessionEntityArgsGQL, [
        'controlState',
        'startDate',
        'endDate',
        'isExposed',
        'lpn',
        'entryEventId',
        'exitEventId',
      ] as const),
    ),
    PickType(ControlSessionEntityArgsGQL, ['upsId'] as const),
  ),
) {
  //: API / MS
  @ApiPropertyOptional({ type: Number })
  @Field(() => Int, { nullable: true })
  minUncoveredDuration?: number | null;
}
