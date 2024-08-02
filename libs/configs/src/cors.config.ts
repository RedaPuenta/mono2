import { registerAs } from '@nestjs/config';

export type CORSConfigType = {
  origin: string;
  methods: string[];
  preflightContinue: boolean;
  optionsSuccessStatus: number;
};

export const CORSConfig = registerAs(
  'cors',
  (): CORSConfigType =>
    Object.freeze({
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
      optionsSuccessStatus: 200,
    }),
);
