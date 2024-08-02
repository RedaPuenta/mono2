import { FpsEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'fps', timestamps: true })
export class Fps extends FpsEntityMongo {}
