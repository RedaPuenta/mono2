import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fps } from './schemas/fps.schema';
import { MongoService } from '@lib/modules';

@Injectable()
export class FpsService extends MongoService<Fps> {
  constructor(@InjectModel(Fps.name) protected model: Model<Fps>) {
    super(model);
  }
}
