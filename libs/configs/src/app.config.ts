import {
  AppRegistryNameType,
  AppRegistryNamingType,
  AppRegistrySpecimenType,
  EnvironmentType,
  appRegistry,
  environment,
} from '@lib/registrys';
import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import Joi from 'joi';
import * as uuid from 'uuid';

export type AppConfigType = {
  id: string;
  startDate: number;
  env: EnvironmentType;
  port: number;
  name: AppRegistryNameType;
  naming: AppRegistryNamingType;
  timeout: number;
  specimen: AppRegistrySpecimenType;
};

export const AppConfig = (appName: AppRegistryNameType) =>
  registerAs('app', (): AppConfigType => {
    const { localPort, code, specimen, naming } = appRegistry[appName];
    return Object.freeze({
      id: uuid.v4(),
      startDate: new Date().getTime(),
      env: process.env.APP_ENV! as AppConfigType['env'],
      port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : localPort,
      timeout: parseInt(process.env.APP_TIMEOUT!),
      name: appName,
      naming,
      code,
      specimen,
    });
  });

export const AppConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .required()
      .valid(...Object.keys(environment)),
    APP_PORT: Joi.alternatives().conditional('APP_ENV', {
      is: 'local',
      then: Joi.optional(),
      otherwise: Joi.number().port().required(),
    }),
    APP_TIMEOUT: Joi.number().min(1000).required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
