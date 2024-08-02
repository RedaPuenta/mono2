import { ValidatorsType } from '@lib/registrys';
import { applyDecorators } from '@nestjs/common';
import { Field, Float, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, Max, Min } from 'class-validator';
import mongoose from 'mongoose';
import { ContextValidatorType } from './context.decorator';

export function NumberValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  byDefault,
  min,
  max,
  index = false,
  type = 'int',
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  byDefault?: number;
  min?: number;
  max?: number;
  index?: boolean;
  type?: 'int' | 'float';
}) {
  const decorators: MethodDecorator[] = [
    (required ? ApiProperty : ApiPropertyOptional)({
      type: Number,
      required,
      description,
    }),
  ];

  if (required) decorators.push(IsDefined());
  if (min) decorators.push(Min(min));
  if (max) decorators.push(Max(max));

  switch (context.validator) {
    case 'graphql':
      if (validatorsConcerned.includes('graphql')) {
        decorators.push(
          Field(() => (type === 'int' ? Int : Float), {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      if (validatorsConcerned.includes('class_validator')) {
        decorators.push(IsNumber());
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      if (validatorsConcerned.includes('mongodb')) {
        decorators.push(
          Prop({
            type: mongoose.Schema.Types.Number,
            required,
            default: byDefault,
            min,
            max,
            index,
            isInteger: type === 'int',
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
