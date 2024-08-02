import { HashingService, MongoService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CameraEvent } from './schemas/camera-events.schema';
import { UpsDeletionDelays } from './dto/anonymize-orfans.dto';

type SimpleOrphan = {
  _id: ObjectId;
  lpn: string;
  resources: string[];
};

@Injectable()
export class CameraEventsService extends MongoService<CameraEvent> {
  constructor(
    @InjectModel(CameraEvent.name) protected model: Model<CameraEvent>,
    private hashingService: HashingService,
  ) {
    super(model);
  }

  private anonymizer({ _id, lpn }: SimpleOrphan) {
    return {
      updateOne: {
        filter: { _id },
        update: {
          $set: {
            'vehicle.lpn': this.hashingService.hash({
              payload: lpn,
              length: 5,
              algorithm: 'md5',
              digest: 'hex',
            }),
          },
          resources: [],
        },
      },
    };
  }

  // --------------------
  // Handle customize search fields
  // --------------------
  async paramize(params: any): Promise<any> {
    const search: any = {};

    const promises = Object.keys(params).map(async (key) => {
      const value = params[key];

      switch (key) {
        case 'channels':
          // Search for specified channels
          const channelsList = Array.isArray(value) ? value : [value];

          search['channels'] = {
            $all: channelsList.map(({ channel, _id }) => {
              // Check if there is many ids to get (OR)
              const hasMany = Array.isArray(_id);
              return {
                $elemMatch: { channel, _id: hasMany ? { $in: _id } : _id },
              };
            }),
          };
          break;
        case 'cameraEventId':
          search['_id'] = value;
          break;
        case 'lpn':
          search['vehicle.lpn'] = value;
          break;
        case 'lpnLike':
          search['vehicle.lpn'] = { $regex: new RegExp(`^${value}`, 'i') };
          break;
        case 'startDate':
          search['happenedAt'] = {
            ...search['happenedAt'],
            $gte: new Date(value),
          };
          break;
        case 'endDate':
          search['happenedAt'] = {
            ...search['happenedAt'],
            $lte: new Date(value),
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

  async anonymizeOrphansAndGetResources(
    deletionDelays: UpsDeletionDelays[],
  ): Promise<string[]> {
    const orphans: SimpleOrphan[] = await this.model.aggregate(
      this.buildOrfanFinder(deletionDelays),
    );

    if (orphans.length === 0) return [];

    console.log(
      `THE ANONYMIZER: I'm going to anonimyze ${orphans.length} orphans, I hope you're ok with that`,
    );
    console.log(
      `Victims list: ${orphans.map(({ _id }) => _id).join(', ')}\n\n`,
    );

    // anonymize them
    await this.model.bulkWrite(orphans.map(this.anonymizer));

    return orphans.flatMap(({ resources }) => resources);
  }

  private buildOrfanFinder = (deletionDelays: UpsDeletionDelays[]) => [
    {
      $match: {
        knownLpn: true,
      },
    },
    {
      $lookup: {
        from: 'control-sessions',
        let: { eventId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$entryEventId', '$$eventId'] },
                  { $eq: ['$exitEventId', '$$eventId'] },
                ],
              },
            },
          },
        ],
        as: 'session_data',
      },
    },
    {
      $match: {
        session_data: { $size: 0 },
      },
    },
    {
      $project: {
        _id: 1,
        happenedAt: 1,
        resources: 1,
        lpn: '$vehicle.lpn',
        channels: 1,
      },
    },
    {
      $unwind: '$channels',
    },
    {
      $group: {
        _id: '$channels._id',
        events: {
          $push: {
            _id: '$_id',
            lpn: '$lpn',
            happenedAt: '$happenedAt',
            resources: '$resources',
          },
        },
      },
    },
    {
      $addFields: {
        deletionDelay: {
          $switch: {
            branches: deletionDelays.map(({ upsId, delays }) => ({
              case: {
                $eq: ['$_id', upsId],
              },
              then: delays.incomplete || 0,
            })),
            default: 0,
          },
        },
      },
    },
    {
      $match: {
        deletionDelay: { $gte: 0 },
      },
    },
    {
      $addFields: {
        cutoffDate: {
          $subtract: [
            new Date(),
            { $multiply: ['$deletionDelay', 24, 60, 60, 1000] },
          ],
        },
      },
    },
    {
      $project: {
        events: {
          $filter: {
            input: '$events',
            as: 'event',
            cond: { $lt: ['$$event.happenedAt', '$cutoffDate'] },
          },
        },
      },
    },
    {
      $unwind: '$events',
    },
    {
      $project: {
        _id: '$events._id',
        lpn: '$events.lpn',
        resources: '$events.resources',
      },
    },
  ];
}
