import { ValidatorsType } from '@lib/registrys';
import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Field } from '@nestjs/graphql';
import { applyDecorators } from '@nestjs/common';
import mongoose from 'mongoose';
import { ContextValidatorType } from './context.decorator';

export function BooleanValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  byDefault,
  index = false,
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  byDefault?: boolean;
  index?: boolean;
}) {
  const decorators: MethodDecorator[] = [
    (required ? ApiProperty : ApiPropertyOptional)({
      type: Boolean,
      required,
      description,
    }),
  ];

  if (required) decorators.push(IsDefined());

  switch (context.validator) {
    case 'graphql':
      if (validatorsConcerned.includes('graphql')) {
        decorators.push(
          Field(() => Boolean, {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      if (validatorsConcerned.includes('class_validator')) {
        decorators.push(IsBoolean());
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      if (validatorsConcerned.includes('mongodb')) {
        decorators.push(
          Prop({
            type: mongoose.Schema.Types.Boolean,
            required,
            default: byDefault,
            index,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
