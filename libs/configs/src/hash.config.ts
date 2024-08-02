import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type HashConfigType = {
  salt: number;
};

export const HashConfig = registerAs(
  'hash',
  (): HashConfigType =>
    Object.freeze({
      salt: parseInt(process.env.HASH_SALT!),
    }),
);

export const HashConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    HASH_SALT: Joi.number().min(1).max(10).required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
