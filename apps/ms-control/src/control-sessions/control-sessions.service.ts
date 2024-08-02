import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ControlSession } from './schemas/control-sessions.schema';
import { MongoService } from '@lib/modules';

@Injectable()
export class ControlSessionsService extends MongoService<ControlSession> {
  constructor(
    @InjectModel(ControlSession.name) protected model: Model<ControlSession>,
  ) {
    super(model);
  }

  async paramize(params: any): Promise<any> {
    const search: any = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];

      switch (key) {
        case 'minUncoveredDuration':
          search['uncoveredDuration'] = { $gte: value };
          break;

        case 'minStartDate':
          search['startDate'] = { $gte: value };

          break;
        case 'maxEndDate':
          search['endDate'] = { $lte: value };
          break;

        case 'maxSessionDurationInHours':
          search['$expr'] = {
            $lt: [
              { $subtract: ['$endDate', '$startDate'] },
              value * 60 * 60 * 1000,
            ],
          };
          break;
        case 'channels':
          // Search for specified channels
          const channelsList = Array.isArray(value) ? value : [value];

          search.channels = {
            $all: channelsList.map(({ channel, _id }) => {
              // Check if there is many ids to get (OR)
              const hasMany = Array.isArray(_id);
              return {
                $elemMatch: { channel, _id: hasMany ? { $in: _id } : _id },
              };
            }),
          };
          break;

        default:
          search[key] = value;
          break;
      }
    });

    return search;
  }

  async handleOldSessions(lpn: any, upsId: any): Promise<void> {
    await this.model.updateMany(
      {
        lpn,
        upsId,
        controlState: 'UNDEFINED',
        exitEventId: { $exists: false },
      },
      { controlState: 'ERROR' },
    );
  }
}
