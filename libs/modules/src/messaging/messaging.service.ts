import { AppRegistryNameType, appRegistry } from '@lib/registrys';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('BUS_INTERN') private readonly busIntern: ClientProxy,
    @Inject('BUS_EXTERN') private readonly busExtern: ClientProxy,
    private hashingService: HashingService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private busCurrent(app: AppRegistryNameType) {
    return appRegistry[app].specimen === 'microservice'
      ? this.busIntern
      : this.busExtern;
  }

  public async send<T>({
    app,
    pattern,
    payload,
    cache,
  }: {
    app: AppRegistryNameType;
    pattern: string;
    payload: unknown;
    cache?: { cache: boolean; cacheTtl: number };
  }): Promise<T> {
    const target = `${appRegistry[app].pattern}:${pattern}`;
    const cacheKey = await this.cacheKey({ target, payload });

    if (cache) {
      const cacheGet = await this.cacheManager.get<T>(cacheKey);
      if (cacheGet) return cacheGet;
    }

    const response = await firstValueFrom(
      this.busCurrent(app).send(target, payload),
    );

    if (cache) {
      await this.cacheManager.set(cacheKey, response, cache.cacheTtl);
    }

    return response;
  }

  public async emit({
    app,
    pattern,
    payload,
    cache,
  }: {
    app: AppRegistryNameType;
    pattern: string;
    payload: unknown;
    cache?: { cache: boolean; cacheTtl: number };
  }) {
    const target = `${appRegistry[app].pattern}:${pattern}`;
    this.busCurrent(app).emit(target, payload);
  }

  private async cacheKey({
    payload,
    target,
  }: {
    payload: unknown;
    target: string;
  }): Promise<string> {
    return `${target}-${this.hashingService.hash({
      algorithm: 'sha256',
      digest: 'base64',
      payload: JSON.stringify(payload),
    })}`;
  }
}
