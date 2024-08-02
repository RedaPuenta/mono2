import { GlobalConfigComposeCV } from '@lib/data';
import { HashingService, MessagingService, UtilService } from '@lib/modules';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { P1000Config } from './entities/p1000-config';

export type ClientConfigResponse = {
  computedConfig: GlobalConfigComposeCV;
  ups: {
    payload: {
      legacyId: string;
    };
  };
  client: {
    slug: string;
  };
};

@Injectable()
export class P1000Service {
  constructor(
    private httpService: HttpService,
    private messagingService: MessagingService,
    private config: ConfigService,
    private hashingService: HashingService,
    private utilService: UtilService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Fetches the client configuration for a given UPS ID.
   * @param upsId The UPS ID for which to fetch the client configuration.
   * @returns A promise that resolves to the client configuration response. @see ClientConfigResponse
   * @throws If an error occurs while fetching the client configuration.
   */
  async fetchClientConfig(upsId: string): Promise<ClientConfigResponse | null> {
    try {
      const clientConfigResponse =
        await this.messagingService.send<ClientConfigResponse>({
          app: 'MS_CLIENT',
          pattern: 'ups:config',
          payload: {
            cache: true,
            cacheTtl: 1000 * 60,
          },
        });

      return clientConfigResponse;
    } catch (error) {
      console.error('An issue occured while fetching client config', error);
      return null;
    }
  }

  /**
   * Returns the URL for a given operation (ex: show_parking_right, beep_history etc) and P1000 configuration.
   * @param op - The operation to perform.
   * @param p1000Conf - The P1000 configuration. @see P1000Config
   * @returns The URL for the given operation and configuration.
   */
  getP1000URL(op: string, p1000Conf: P1000Config): string {
    const { url, port, path, user, password, multisite_tag_id, tag_id } =
      p1000Conf;

    return (
      `https://${url}:${port}${path}/json/restful/v1/${op}.php?` +
      `username=${user}` +
      `&password=${password}` +
      `&multisite_tag_id=${multisite_tag_id}` +
      `&tag_id=${tag_id ?? multisite_tag_id}`
    );
  }

  /**
   * Queries the P1000 API with the specified operation, configuration, and payload.
   * @param op The operation to perform.
   * @param p1000Conf The P1000 configuration to use. @see P1000Config
   * @param queryPayload The payload to send with the query.
   * @returns The data returned by the P1000 API.
   * @throws {P1000Error} If an error occurs while querying the P1000 API.
   */
  async queryP1000(op: string, p1000Conf: P1000Config, queryPayload: object) {
    const url = this.getP1000URL(op, p1000Conf);
    return this.queryP10002(url, queryPayload);
  }

  /**
   * Queries the P10002 endpoint with the given operation, URL, and payload.
   * @param url The URL to query, with '<OP>' as a placeholder for the operation.
   * @param queryPayload The payload to send with the query.
   * @returns The data returned by the P10002 endpoint.
   * @throws {P1000Error} If there was an error querying the P10002 endpoint.
   */
  async queryP10002(
    url: string,
    queryPayload: object,
    mapper: Function = this.utilService.IDENTITY,
    opts = { cache: false, cacheTtl: 5000 },
  ) {
    try {
      let cacheKey = '';

      if (opts.cache) {
        cacheKey = await this.hashingService.hash({
          payload: `${url}-${JSON.stringify(queryPayload)}`,
          algorithm: 'md5',
          digest: 'hex',
        });

        const cachedResponse = await this.cacheManager.get(cacheKey);
        if (cachedResponse) return cachedResponse;
      }

      console.log('P1000 Query: ', url, JSON.stringify(queryPayload));

      const response: { data: { data: unknown } } = await lastValueFrom(
        this.httpService.post(url, JSON.stringify(queryPayload), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const mappedResponse = mapper(response);

      if (opts.cache && mappedResponse) {
        await this.cacheManager.set(cacheKey, mappedResponse, opts.cacheTtl);
      }

      return mappedResponse;
    } catch (error) {
      console.error('An issue occured while querying P1000', error);
    }
  }

  async queryApi(
    op: string,
    payload: object,
    mapper: Function = this.utilService.IDENTITY,
  ) {
    try {
      const { host, token } = this.config.get('prestoplatform');

      const response = await lastValueFrom(
        this.httpService.post(host + '/fines-search', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const mappedResponse = mapper(response);

      return mappedResponse;
    } catch (error) {
      console.error('An issue occured while querying P1000', error);
      return null;
    }
  }
}
