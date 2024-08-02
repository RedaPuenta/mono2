import { GlobalConfigComposeType } from '@lib/data';
import { Client } from '../../clients/schemas/client.schema';
import { Ups } from '../schemas/ups.schema';

export class UpsWithConfig {
  ups!: Ups;
  client!: Client;
  computedConfig!: GlobalConfigComposeType;
}
