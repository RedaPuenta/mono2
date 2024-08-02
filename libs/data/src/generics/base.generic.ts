import {
  Context,
  ContextValidatorType,
  DateValidator,
  StringValidator,
} from '@lib/decorators';

export const BaseGeneric = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Base {
    @StringValidator({
      validatorsConcerned: ['graphql', 'class_validator'],
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    _id!: string;

    @DateValidator({
      context,
      validatorsConcerned: ['graphql', 'class_validator'],
      required: true,
    })
    createdAt!: string;

    @DateValidator({
      context,
      validatorsConcerned: ['graphql', 'class_validator'],
      required: true,
    })
    updatedAt!: string;
  }

  return Base;
};
