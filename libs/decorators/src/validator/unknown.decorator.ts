import { ValidatorsType } from '@lib/registrys';
import { Prop } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Field } from '@nestjs/graphql';
import { applyDecorators } from '@nestjs/common';
import mongoose from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnknownScalar } from '@lib/scalars';
import { ContextValidatorType } from './context.decorator';

export function UnknownValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  byDefault,
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  byDefault?: unknown;
}) {
  const decorators: MethodDecorator[] = [
    (required ? ApiProperty : ApiPropertyOptional)({
      required,
      description,
    }),
  ];

  switch (context.validator) {
    case 'graphql':
      if (validatorsConcerned.includes('graphql')) {
        decorators.push(
          Field(() => UnknownScalar, {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      if (validatorsConcerned.includes('class_validator')) {
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      if (validatorsConcerned.includes('mongodb')) {
        decorators.push(
          Prop({
            type: mongoose.Schema.Types.Mixed,
            required,
            default: byDefault,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
