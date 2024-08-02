import {
  ArgsType,
  Field,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { PaginationParamsGenericArgsGQL, PagingGeneric } from '@lib/data';
import { ResourcesEntity } from '../entities/resources.entity';
import { ApiProperty } from '@nestjs/swagger';
@ObjectType()
export class SearchResourceResponseDto extends PagingGeneric<ResourcesEntity>({
  validator: 'graphql',
  type: 'object',
  entity: ResourcesEntity,
}) {}

@ArgsType()
export class SearchResourceDto extends IntersectionType(
  PaginationParamsGenericArgsGQL,
  PartialType(PickType(ResourcesEntity, [] as const)),
) {
  @Field((type) => [String])
  @ApiProperty({ type: [String] })
  resourcesIds!: string[];
}
