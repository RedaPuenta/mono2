import { ValidatorsType } from '@lib/registrys';
import { Prop } from '@nestjs/mongoose';
import { IsOptional, ValidateNested } from 'class-validator';
import { Field } from '@nestjs/graphql';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContextValidatorType } from './context.decorator';
import { Type } from 'class-transformer';

export declare namespace EntityValidatorType {
  type Props = {
    context: ContextValidatorType.Props;
    validatorsConcerned?: ValidatorsType[];
    required: boolean;
    description?: string;
    entity: EntityValidatorType.EntityPanel;
  };

  type Entity =
    | { new (...args: any[]): any }
    | Array<{ new (...args: any[]): any }>;

  type EntityPanel = {
    graphql: {
      object: () => EntityValidatorType.Entity;
      args: () => EntityValidatorType.Entity;
      input: () => EntityValidatorType.Entity;
    };
    class_validator: () => EntityValidatorType.Entity;
    mongodb: () => EntityValidatorType.Entity;
  };
}

export function EntityValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  entity,
}: EntityValidatorType.Props) {
  const decorators: MethodDecorator[] = [];

  if (!entity) return applyDecorators();

  switch (context.validator) {
    case 'graphql':
      const CurrentEntityGQL = entity[context.validator][context.type]();

      if (validatorsConcerned.includes('graphql') && CurrentEntityGQL) {
        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: CurrentEntityGQL,
            required,
            description,
          }),
        );

        decorators.push(
          Field(() => CurrentEntityGQL, {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      const CurrentEntityCV = entity[context.validator]();

      if (validatorsConcerned.includes('class_validator') && CurrentEntityCV) {
        decorators.push(ValidateNested({ each: true }));
        if (!required) decorators.push(IsOptional());

        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: CurrentEntityCV,
            required,
            description,
          }),
        );

        decorators.push(Type(() => CurrentEntityCV as any));
      }
      break;

    case 'mongodb':
      const CurrentEntityMongoDB = entity[context.validator]();

      if (validatorsConcerned.includes('mongodb') && CurrentEntityMongoDB) {
        decorators.push(
          (required ? ApiProperty : ApiPropertyOptional)({
            type: CurrentEntityMongoDB,
            required,
            description,
          }),
        );

        decorators.push(
          Prop({
            type: CurrentEntityMongoDB,
            required,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
