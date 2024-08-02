import { faker } from '@faker-js/faker';
import { MongoService, UtilService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Site } from './schemas/site.schema';

@Injectable()
export class SitesService extends MongoService<Site> {
  constructor(
    @InjectModel(Site.name) protected model: Model<Site>,
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
      const value = params[key];

      switch (key) {
        case 'siteId':
          search['_id'] = value;
          break;
        default:
          search[key] = value;
          break;
      }
    });

    return search;
  }

  // -------------------------
  // Find site IDs only without limit
  // -------------------------
  async getIds(search: any = {}): Promise<Array<string>> {
    // On nettoie les données en entrée
    const cleanedQuery = this.cleanModelData(search);
    const paramizedQuery: any = await this.paramize(cleanedQuery);

    // On lance la recherche
    const items = await this.model.find(paramizedQuery, { _id: 1 }).exec();
    const ids = items.map(({ _id }) => _id.toString());
    return ids;
  }

  // --------------------
  // Get final site configuration
  // --------------------
  async getSiteConfig(siteId: string) {
    // Get site with all populates
    const site: any = await this.model.findOne(
      { _id: new Types.ObjectId(siteId) },
      {},
      { populate: ['clientId', 'upsId'] },
    );

    if (!site) throw new Error(`Unknown site ${siteId}`);

    const { code, defaultCurrency: currency, timezone } = site.get('clientId');
    const additionnalConfigs = {
      prestoOne: { config: { client: { code, timezone }, coin: { currency } } },
    };

    // Compute configs
    const convert = (obj: any) => JSON.parse(JSON.stringify(obj || {}));
    const config = this.utilService.deepMerge(
      convert(site.get('clientId.config')),
      additionnalConfigs,
      convert(site.get('upsId.config')),
      convert(site.get('config')),
    );

    return { site, config };
  }

  // --------------------
  // Generate a random name
  // --------------------
  generateSiteName() {
    const random = () => faker.person.firstName();
    const first = random();
    const second = random();
    return `${first}-${second}`;
  }

  // --------------------
  // Handle site rendering
  // --------------------
  async render<T>(list: any = {}, options: any = {}): Promise<T> {
    const fields = options.fields || [
      '_id',
      'clientId',
      'upsId',
      'terminalId',
      'name',
      'address1',
      'address2',
      'zipcode',
      'city',
      'country',
      'coordinates',
      'config',
    ];

    return super.render<T>(list, { fields });
  }
}
