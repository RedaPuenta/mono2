export const validators = Object.freeze({
  graphql: 'graphql',
  class_validator: 'class_validator',
  mongodb: 'mongodb',
} as const);

export type ValidatorsType = keyof typeof validators;
