import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import { NatsOptions, Transport } from '@nestjs/microservices';
import Joi from 'joi';

export type BusInternConfigType = NatsOptions;

export const BusInternConfig = registerAs(
  'bus_intern',
  (): BusInternConfigType => ({
    transport: Transport.NATS,
    options: {
      servers: process.env.INTERN_BUS_HOSTS
        ? process.env.INTERN_BUS_HOSTS.split(',').filter(Boolean)
        : ['nats://localhost:4222'],
      noRandomize: true,
      queue: 'yoonite',
      token: process.env.INTERN_BUS_TOKEN || 'T0pS3cr3trr',
      maxReconnectAttempts: -1,
      reconnect: true,
      pingInterval: 30000,
      maxPingOut: 4,
    },
  }),
);

export const BusInternConfigEnv: ConfigModuleOptions = {
  expandVariables: true,
  validationSchema: Joi.object({
    INTERN_BUS_TOKEN: Joi.alternatives().conditional('APP_ENV', {
      is: 'local',
      then: Joi.optional(),
      otherwise: Joi.string().alphanum().min(10).max(10000).required(),
    }),
    INTERN_BUS_HOSTS: Joi.alternatives().conditional('APP_ENV', {
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
