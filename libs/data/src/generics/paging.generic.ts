import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';

export const PaginationParamsGeneric = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PaginationParams {
    @NumberValidator({
      context,
      required: false,
    })
    page?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    limit?: number | null;

    @StringValidator({
      context,
      required: false,
    })
    order?: string | null;
  }

  return PaginationParams;
};

@Context({ validator: 'graphql', type: 'object' })
export class PaginationParamsGenericObjectGQL extends PaginationParamsGeneric({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class PaginationParamsGenericArgsGQL extends PaginationParamsGeneric({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class PaginationParamsGenericInputGQL extends PaginationParamsGeneric({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class PaginationParamsGenericCV extends PaginationParamsGeneric({
  validator: 'class_validator',
}) {}



const PaginationResultGeneric = (context: ContextValidatorType.Props) => {
  @Context(context)
  class PaginationResult {
    @NumberValidator({
      context,
      required: true,
    })
    current!: number;

    @NumberValidator({
      context,
      required: true,
    })
    count!: number;

    @NumberValidator({
      context,
      required: true,
    })
    limit!: number;
  }

  return PaginationResult;
};

@Context({ validator: 'graphql', type: 'object' })
class PaginationResultObjectGQL extends PaginationResultGeneric({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
class PaginationResultArgsGQL extends PaginationResultGeneric({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
class PaginationResultInputGQL extends PaginationResultGeneric({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
class PaginationResultCV extends PaginationResultGeneric({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
class PaginationResultMongo extends PaginationResultGeneric({
  validator: 'mongodb',
}) {}

export const PagingGeneric = <T>({
  entity,
  ...context
}: ContextValidatorType.Props & {
  entity: EntityValidatorType.Entity;
}) => {
  @Context(context)
  class Paging {
    @EntityValidator({
      validatorsConcerned: ['graphql', 'class_validator'],
      context,
      required: true,
      entity: {
        graphql: {
          object: () => entity,
          args: () => entity,
          input: () => entity,
        },
        class_validator: () => entity,
        mongodb: () => entity,
      },
    })
    list!: T[];

    @EntityValidator({
      context,
      validatorsConcerned: ['graphql', 'class_validator'],
      required: true,
      entity: {
        graphql: {
          object: () => PaginationResultObjectGQL,
          args: () => PaginationResultArgsGQL,
          input: () => PaginationResultInputGQL,
        },
        class_validator: () => PaginationResultCV,
        mongodb: () => PaginationResultMongo,
      },
    })
    paging!: PaginationResultCV;
  }

  return Paging;
};
