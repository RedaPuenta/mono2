import { EnvironmentType, environment } from '@lib/registrys';
import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type GraphQLConfigType = {
  env: EnvironmentType;
};

export const GraphQLConfig = registerAs(
  'graphql',
  (): GraphQLConfigType =>
    Object.freeze({
      env: process.env.APP_ENV! as GraphQLConfigType['env'],
    }),
);

export const GraphQLConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .required()
      .valid(...Object.keys(environment)),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
