import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type MongoConfigType = {
  uri: string;
};

export const MongoConfig = registerAs(
  'mongo',
  (): MongoConfigType =>
    Object.freeze({
      uri: process.env.MONGO_URI!,
    }),
);

export const MongoConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    MONGO_URI: Joi.string().uri().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
