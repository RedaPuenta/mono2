import { MongoService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schemas/client.schema';

@Injectable()
export class ClientsService extends MongoService<Client> {
  constructor(@InjectModel(Client.name) protected model: Model<Client>) {
    super(model);
  }

  // --------------------
  // Handle custom search fields for search
  // --------------------
  async paramize(params: any): Promise<any> {
    const search: any = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];

      switch (key) {
        case 'clientId':
          search['_id'] = value;
          break;
        case 'clientIds':
          search['_id'] = { $in: value };
          break;
        case 'slugs':
          search['slug'] = { $in: value };
          break;
        case 'slug':
          search['slug'] = {
            $regex: '.*' + value + '.*',
          };
          break;

        default:
          search[key] = value;
          break;
      }
    });

    return search;
  }

  // --------------------
  // Handle rendering
  // --------------------
  async render<T>(list: any = {}): Promise<T> {
    const fields = [
      '_id',
      'slug',
      'name',
      'code',
      'timezone',
      'locale',
      'defaultCurrency',
      'defaultContractTag',
      'config',
      'siret',
      'translation',
    ];

    return super.render<T>(list, { fields });
  }
}
