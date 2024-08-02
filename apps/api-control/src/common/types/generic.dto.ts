import { HydratedDocument } from 'mongoose';

export type PaginatedQuery = {
  page: number;
  limit: number;
  order: string;
};

export type Paginated<T> = {
  list: HydratedDocument<T>[];
  paging: {
    count: number;
    current: number;
    limit: number;
  };
};

export type SearchDto<EntityType> = any;

export type UpdateDto<T> = { id: string; update: Partial<T> };

export type UpdateManyDto<T> = UpdateDto<T>[];

export type DeleteDto = {
  id: string;
};

export type ReadDto = DeleteDto;

export type DeleteManyDto = {
  ids: string[];
};
