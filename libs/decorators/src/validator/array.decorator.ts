import { ValidatorsType } from '@lib/registrys';
import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDefined, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { ContextValidatorType } from './context.decorator';
import { EntityValidatorType } from './entity.decorator';

export function ArrayValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  entity,
  index = false,
  byDefault,
  ref,
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  index?: boolean;
  byDefault?: unknown[];
  entity: (() => EntityValidatorType.Entity) | EntityValidatorType.EntityPanel;
  ref?: string;
}) {
  const decorators: MethodDecorator[] = [];

  if (required) decorators.push(IsDefined());

  switch (context.validator) {
    case 'graphql':
      const CurrentEntityGQL =
        typeof entity === 'function'
          ? entity()
          : entity[context.validator][context.type]!();

      if (validatorsConcerned.includes('graphql') && CurrentEntityGQL) {
        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: [CurrentEntityGQL],
            required,
            description,
          }),
        );

        decorators.push(
          Field(() => [CurrentEntityGQL], {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      const CurrentEntityCV =
        typeof entity === 'function' ? entity() : entity[context.validator]();

      if (validatorsConcerned.includes('class_validator') && CurrentEntityCV) {
        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: [CurrentEntityCV],
            required,
            description,
          }),
        );

        decorators.push(IsArray());
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      const CurrentEntityMongoDB =
        typeof entity === 'function' ? entity() : entity[context.validator]();

      if (validatorsConcerned.includes('mongodb') && CurrentEntityMongoDB) {
        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: [CurrentEntityMongoDB],
            required,
            description,
          }),
        );

        decorators.push(
          Prop({
            type: ref
              ? [{ type: mongoose.Schema.Types.ObjectId, ref }]
              : mongoose.Schema.Types.Array,
            required,
            index,
            default: byDefault,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
