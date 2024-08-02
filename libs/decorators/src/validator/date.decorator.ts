import { ValidatorsType } from '@lib/registrys';
import { Prop } from '@nestjs/mongoose';
import { IsDateString, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Field, GraphQLISODateTime } from '@nestjs/graphql';
import { applyDecorators } from '@nestjs/common';
import mongoose from 'mongoose';
import { ContextValidatorType } from './context.decorator';
import { DateTime } from '../../../scalars';

export function DateValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  byDefault,
  trim,
  index = false,
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  byDefault?: () => Date;
  trim?: boolean;
  index?: boolean;
}) {
  const decorators: MethodDecorator[] = [
    (required ? ApiProperty : ApiPropertyOptional)({
      type: Date,
      required,
      description,
    }),
  ];

  if (required) decorators.push(IsDefined());

  switch (context.validator) {
    case 'graphql':
      if (validatorsConcerned.includes('graphql')) {
        decorators.push(
          Field(() => DateTime, {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      if (validatorsConcerned.includes('class_validator')) {
        decorators.push(IsDateString());
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      if (validatorsConcerned.includes('mongodb')) {
        decorators.push(
          Prop({
            type: mongoose.Schema.Types.Date,
            get: (val: Date) => (val ? val.toISOString() : null),
            set: (val: string) => (val ? new Date(val) : null),
            required,
            default: byDefault,
            trim,
            index,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
