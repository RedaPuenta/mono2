import { logRegistry } from '@lib/registrys';
import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type LogConfigType = {
  strategy: number;
};

export const LogConfig = registerAs(
  'log',
  (): LogConfigType =>
    Object.freeze({
      strategy: parseInt(process.env.LOG_STRATEGY!),
    }),
);

export const LogConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    LOG_STRATEGY: Joi.binary()
      .length(Object.keys(logRegistry).length)
      .required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
