import { UpsEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'onstreet-ups', timestamps: true })
export class Ups extends UpsEntityMongo {}
