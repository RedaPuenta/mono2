import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type TokenConfigType = {
  secret: string;
  duration: number;
};

export const TokenConfig = registerAs(
  'token',
  (): TokenConfigType =>
    Object.freeze({
      secret: process.env.TOKEN_SECRET!,
      duration: parseInt(process.env.TOKEN_DURATION!),
    }),
);

export const TokenConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    TOKEN_SECRET: Joi.string().alphanum().min(1000).max(10000).required(),
    TOKEN_DURATION: Joi.number().min(86400000).max(31557600000).required(), //! Min: 1d, Max: 1an
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
