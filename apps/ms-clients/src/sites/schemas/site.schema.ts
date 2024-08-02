import { SiteEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'onstreet-sites', timestamps: true })
export class Site extends SiteEntityMongo {}
