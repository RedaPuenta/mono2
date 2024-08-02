import { MongoService, UtilService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/schemas/client.schema';
import { Ups } from './schemas/ups.schema';
import { UpsDeletionDelays } from './types/ups-deletion-delays';

@Injectable()
export class UpsService extends MongoService<Ups> {
  constructor(
    @InjectModel(Ups.name) protected model: Model<Ups>,
    private clientsService: ClientsService,
    private utilService: UtilService,
  ) {
    super(model);
  }

  // --------------------
  // Handle custom search fields for search
  // --------------------
  async paramize(params: any): Promise<any> {
    const search: any = {};

    Object.keys(params).forEach((key) => {
      const value: any = params[key];

      switch (key) {
        case 'upsId':
          search['_id'] = value;
          break;
        case 'upsIds':
          const idList = Array.isArray(value) ? value : [value];
          search['_id'] = { $in: idList };
          break;
        case 'clientIds':
          search['clientId'] = { $in: value };
          break;
        case 'code':
          const codeList = Array.isArray(value) ? value : [value];
          search['code'] = { $in: codeList };
          break;
        case 'codePattern':
          search['code'] = {
            $regex: '^' + value,
          };
          break;
        case 'isPrestoscan':
          search['config.prestoScan'] = { $exists: true };
          break;
        case 'near':
          const { longitude, latitude, radius } = value;
          search['center'] = {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $minDistance: 0,
              $maxDistance: radius,
            },
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
  // Find UPS with final configuration
  // --------------------
  async findWithConfig(search: any) {
    // On nettoie les données en entrée
    const cleanedQuery = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);

    // Get ups with all populates
    const upsList = await this.model.find(
      paramizedQuery,
      {},
      { populate: 'clientId' },
    );

    // Compute configs
    const formattedList = await Promise.all(
      (upsList || []).map((ups) => this.renderWithConfig(ups)),
    );
    return formattedList;
  }

  // --------------------
  // Get UPS with final configuration
  // --------------------
  async getUpsWithConfig(upsId: string) {
    // Get ups with all populates
    const ups: any = await this.model.findOne(
      { _id: new Types.ObjectId(upsId) },
      {},
      { populate: 'clientId' },
    );

    if (!ups) throw new Error(`Unknwon UPS ${upsId}`);

    // Handle config
    return this.renderWithConfig(ups);
  }

  // --------------------
  // --------------------
  async renderWithConfig(ups: any) {
    const { code, defaultCurrency: currency, timezone } = ups.get('clientId');
    const additionnalConfigs = {
      prestoOne: { client: { code, timezone }, coin: { currency } },
    };

    const convert = (obj: any) => JSON.parse(JSON.stringify(obj || {}));
    const config = this.utilService.deepMerge(
      convert(ups.get('clientId.config')),
      additionnalConfigs,
      convert(ups.get('config')),
    );

    // Get separate entities
    const client = await this.clientsService.render<Client>(
      ups.get('clientId'),
    );

    const renderedUps = await this.render<Ups>(ups);
    renderedUps.clientId = client._id.toString();

    return { ups: renderedUps, client, computedConfig: config };
  }

  // --------------------
  // Handle rendering
  // --------------------
  async render<T>(list: any = {}): Promise<T> {
    const fields = [
      '_id',
      'code',
      'center',
      'clientId',
      'translation',
      'maximumDuration',
      'type',
      'config',
      'shape',
      'shapeColor',
      'createdAt',
      'updatedAt',
      'payload',
      'address',
      'location',
      'computedConfig',
      'occupancy',
      'capacity',
    ];

    return super.render<T>(list, { fields });
  }

  async fetchDeletionDelays(): Promise<UpsDeletionDelays[]> {
    return await this.model.aggregate([
      {
        $match: {
          'config.prestoScan.deletionDelay': { $exists: true },
        },
      },
      {
        $project: {
          _id: 0,
          upsId: '$_id',
          delays: '$config.prestoScan.deletionDelay',
        },
      },
    ]);
  }
}
