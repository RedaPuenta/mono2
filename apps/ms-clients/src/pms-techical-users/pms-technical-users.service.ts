import { MongoService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PmsTechnicalUser } from './schemas/pms-technical-user.schema';

@Injectable()
export class PmsTechnicalUsersService extends MongoService<PmsTechnicalUser> {
  constructor(
    @InjectModel(PmsTechnicalUser.name)
    protected model: Model<PmsTechnicalUser>,
  ) {
    super(model);
  }

  // --------------------
  // Handle customize search fields
  // --------------------
  async paramize(params: any): Promise<any> {
    const search: any = {};

    const promises = Object.keys(params).map(async (key) => {
      const value = params[key];

      switch (key) {
        case 'userId':
          search['_id'] = value;
          break;
        case 'usernamePattern':
          search['username'] = {
            $regex: '^' + value,
          };
          break;
        default:
          search[key] = value;
          break;
      }
    });

    await Promise.all(promises);

    return search;
  }

  // --------------------
  // Create a new user
  // --------------------
  async createFromScratch(createParams: any) {
    const {
      accountId,
      username,
      firstName,
      lang,
      lastName,
      fpsAgentId,
      fpsAgentName,
      upsId,
    } = createParams;

    // Create user
    const user = await this.createOne({
      accountId,
      username,
      lastName,
      firstName,
      fpsAgentId,
      fpsAgentName,
      lang,
      ups: [upsId],
    });

    return user;
  }
  // --------------------
  // Handle contract rendering
  // --------------------
  async render<T>(list: any = {}): Promise<T> {
    const fields = [
      '_id',
      'lang',
      'phone',
      'lastName',
      'firstName',
      'username',
      'createdAt',
      'accountId',
    ];
    return super.render<T>(list, { fields });
  }
}
