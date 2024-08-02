import { PmsTechnicalUserEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'pms-technical-users', timestamps: true })
export class PmsTechnicalUser extends PmsTechnicalUserEntityMongo {}
