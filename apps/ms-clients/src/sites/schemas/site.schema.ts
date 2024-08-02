import { SiteEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SiteDocument = Site & mongoose.Document;

@Schema({ collection: 'onstreet-sites', timestamps: true })
export class Site extends SiteEntityMongo {}

export const SiteSchema = SchemaFactory.createForClass(Site);
