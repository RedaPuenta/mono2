import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    return GqlExecutionContext.create(ctx).getContext().req.user;
  },
);
