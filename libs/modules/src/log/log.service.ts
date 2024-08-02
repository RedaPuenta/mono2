import { LogConfigType } from '@lib/configs/src/log.config';
import { LogRegistryNameType, logRegistry } from '@lib/registrys';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { inspect } from 'util';

@Injectable()
export class LogService implements LogService {
  constructor(
    private configService: ConfigService<{
      log: LogConfigType;
    }>,
  ) {}

  private defaultDepth = 5;

  private formattedMessage({
    message,
    payload,
    depth,
    name,
  }: {
    message: string;
    payload?: unknown;
    depth: number | null;
    name: LogRegistryNameType;
  }) {
    if (this.shouldShowMyMessage(name)) {
      const log: unknown[] = [
        logRegistry[name].color,
        `-> ${logRegistry[name].prefix} - ${inspect(message, { depth })}`,
      ];

      if (payload) log.push(payload);

      console.log(...log);
    }
  }

  private shouldShowMyMessage(type: LogRegistryNameType): boolean {
    const strategy = this.configService.get('log.strategy', { infer: true })!;
    const index = Object.keys(logRegistry).findIndex((value) => value === type);
    return `${strategy}`.charAt(index) === '1' ? true : false;
  }

  public success({
    message,
    payload,
    depth = this.defaultDepth,
  }: {
    message: string;
    payload?: unknown;
    depth?: number | null;
  }) {
    this.formattedMessage({ message, payload, depth, name: 'success' });
  }

  public error({
    message,
    payload,
    depth = this.defaultDepth,
  }: {
    message: string;
    payload?: unknown;
    depth?: number | null;
  }) {
    this.formattedMessage({ message, payload, depth, name: 'error' });
  }

  public warn({
    message,
    payload,
    depth = this.defaultDepth,
  }: {
    message: string;
    payload?: unknown;
    depth?: number | null;
  }) {
    this.formattedMessage({ message, payload, depth, name: 'warn' });
  }

  public debug({
    message,
    payload,
    depth = this.defaultDepth,
  }: {
    message: string;
    payload?: unknown;
    depth?: number | null;
  }) {
    this.formattedMessage({ message, payload, depth, name: 'debug' });
  }
}
