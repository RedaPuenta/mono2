import { MongoService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Terminal } from './schemas/terminal.schema';

@Injectable()
export class TerminalsService extends MongoService<Terminal> {
  constructor(@InjectModel(Terminal.name) protected model: Model<Terminal>) {
    super(model);
  }

  // --------------------
  // Handle rendering
  // --------------------
  async render<T>(list: any = {}): Promise<T> {
    const fields = ['_id', 'terminalId'];
    return super.render<T>(list, { fields });
  }
}
