import { GraphQLISODateTime } from '@nestjs/graphql';

export const DateTime = GraphQLISODateTime;

DateTime.serialize = function (value: unknown) {
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  throw new Error(`Invalid date: ${value}`);
};
