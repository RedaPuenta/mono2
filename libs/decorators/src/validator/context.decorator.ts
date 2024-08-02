import { ValidatorsType } from '@lib/registrys';
import { applyDecorators } from '@nestjs/common';
import { ArgsType, InputType, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaOptions } from '@nestjs/mongoose';

export declare namespace ContextValidatorType {
  type Props =
    | ContextValidatorType.GraphQL
    | ContextValidatorType.ClassValidator
    | ContextValidatorType.MongoDB;

  type GraphQL = {
    validator: Extract<ValidatorsType, 'graphql'>;
    type: 'object' | 'args' | 'input';
  };

  type ClassValidator = {
    validator: Extract<ValidatorsType, 'class_validator'>;
  };

  type MongoDB = {
    validator: Extract<ValidatorsType, 'mongodb'>;
  };
}

export function Context(context: ContextValidatorType.Props) {
  const decorators: ClassDecorator[] = [];
  if (context.validator === 'graphql' && context.type === 'object') {
    decorators.push(ObjectType());
  } else if (context.validator === 'graphql' && context.type === 'args') {
    decorators.push(ArgsType());
  } else if (context.validator === 'graphql' && context.type === 'input') {
    decorators.push(InputType());
  } else if (context.validator === 'mongodb') {
    decorators.push(Schema());
  }

  return applyDecorators(...decorators);
}
