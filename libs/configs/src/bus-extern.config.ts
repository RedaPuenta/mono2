import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import { NatsOptions, Transport } from '@nestjs/microservices';
import Joi from 'joi';

export type BusExternConfigType = NatsOptions;

export const BusExternConfig = registerAs(
  'bus_extern',
  (): BusExternConfigType => ({
    transport: Transport.NATS,
    options: {
      servers: process.env.EXTERN_BUS_HOSTS
        ? process.env.EXTERN_BUS_HOSTS.split(',').filter(Boolean)
        : ['nats://localhost:4222'],
      noRandomize: true,
      queue: 'yoonite',
      token: process.env.EXTERN_BUS_TOKEN || 'T0pS3cr3trr',
      maxReconnectAttempts: -1,
      reconnect: true,
      pingInterval: 30000,
      maxPingOut: 4,
    },
  }),
);

export const BusExternConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    EXTERN_BUS_TOKEN: Joi.alternatives().conditional('APP_ENV', {
      is: 'local',
      then: Joi.optional(),
      otherwise: Joi.string().alphanum().min(10).max(10000).required(),
    }),
    EXTERN_BUS_HOSTS: Joi.alternatives().conditional('APP_ENV', {
      is: 'local',
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
