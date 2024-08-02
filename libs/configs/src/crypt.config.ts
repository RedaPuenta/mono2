import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type CryptConfigType = {
  key: string;
  iv: string;
  method:
    | 'aes-128-ccm'
    | 'aes-128-gcm'
    | 'aes-128-ocb'
    | 'aes-192-ccm'
    | 'aes-192-gcm'
    | 'aes-192-ocb'
    | 'aes-256-ccm'
    | 'aes-256-gcm'
    | 'aes-256-cbc';
};

export const CryptConfig = registerAs(
  'crypt',
  (): CryptConfigType =>
    Object.freeze({
      key: process.env.CRYPT_SECRET_KEY!,
      iv: process.env.CRYPT_SECRET_IV!,
      method: 'aes-256-cbc',
    }),
);

export const CryptConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    CRYPT_SECRET_KEY: Joi.string().alphanum().min(1000).max(10000).required(),
    CRYPT_SECRET_IV: Joi.string().alphanum().min(1000).max(10000).required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
