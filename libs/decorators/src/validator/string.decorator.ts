import { ValidatorsType } from '@lib/registrys';
import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsHexColor,
  IsISO31661Alpha2,
  IsISO31661Alpha3,
  IsJWT,
  IsLowercase,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsStrongPassword,
  IsUppercase,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { ContextValidatorType } from './context.decorator';

export function StringValidator({
  context,
  validatorsConcerned = ['graphql', 'class_validator', 'mongodb'],
  required,
  description,
  byDefault,
  enumeration,
  trim,
  special,
  unique = false,
  formalize,
  format,
  index = false,
  minLength,
  maxLength,
}: {
  context: ContextValidatorType.Props;
  validatorsConcerned?: ValidatorsType[];
  required: boolean;
  description?: string;
  byDefault?: string;
  enumeration?: { [key: number]: string };
  trim?: boolean;
  unique?: boolean;
  formalize?: 'lowercase' | 'uppercase';
  format?: 'lowercase' | 'uppercase';
  index?: boolean;
  special?:
    | { type: 'mongoId' }
    | { type: 'email' }
    | { type: 'password' }
    | { type: 'url' }
    | { type: 'phone' }
    | { type: 'country'; iso: 'alpha-2' | 'alpha-3' }
    | { type: 'postalCode' }
    | { type: 'jwt' }
    | { type: 'color'; format: 'hexa' };
  minLength?: number;
  maxLength?: number;
}) {
  const decorators: MethodDecorator[] = [
    (required ? ApiProperty : ApiPropertyOptional)({
      type: String,
      required,
      description,
      enum: enumeration,
    }),
  ];

  if (required) decorators.push(IsDefined());
  if (enumeration) decorators.push(IsEnum(enumeration));
  if (format === 'lowercase') decorators.push(IsLowercase());
  if (format === 'uppercase') decorators.push(IsUppercase());
  if (minLength) decorators.push(MinLength(minLength));
  if (maxLength) decorators.push(MaxLength(maxLength));

  if (special) {
    switch (special.type) {
      case 'mongoId':
        decorators.push(IsMongoId());
        break;
      case 'email':
        decorators.push(IsEmail());
        break;
      case 'url':
        decorators.push(IsUrl());
        break;
      case 'color':
        if (special.format === 'hexa') {
          decorators.push(IsHexColor());
        }
        break;
      case 'phone':
        decorators.push(IsPhoneNumber());
        break;
      case 'postalCode':
        decorators.push(IsPostalCode());
        break;
      case 'jwt':
        decorators.push(IsJWT());
        break;
      case 'country':
        if (special.iso === 'alpha-2') {
          decorators.push(IsISO31661Alpha2());
        } else if (special.iso === 'alpha-3') {
          decorators.push(IsISO31661Alpha3());
        }
        break;
      case 'password':
        decorators.push(
          IsStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
          }),
        );
        break;
    }
  }

  switch (context.validator) {
    case 'graphql':
      if (validatorsConcerned.includes('graphql')) {
        decorators.push(
          Field(() => (enumeration ? enumeration : String), {
            nullable: !required,
            description,
          }),
        );
      }
      break;

    case 'class_validator':
      if (validatorsConcerned.includes('class_validator')) {
        decorators.push(IsString());
        if (!required) decorators.push(IsOptional());
      }
      break;

    case 'mongodb':
      if (validatorsConcerned.includes('mongodb')) {
        decorators.push(
          Prop({
            type: mongoose.Schema.Types.String,
            required,
            default: byDefault,
            trim,
            enum: enumeration,
            unique,
            index: unique || index,
            lowercase: formalize === 'lowercase',
            uppercase: formalize === 'uppercase',
            minlength: minLength,
            maxlength: maxLength,
          }),
        );
      }
      break;
  }

  return applyDecorators(...decorators);
}
