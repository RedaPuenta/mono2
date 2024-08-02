import { PmsTechnicalUserEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PmsTechnicalUserDocument = PmsTechnicalUser & mongoose.Document;

@Schema({ collection: 'pms-technical-users', timestamps: true })
export class PmsTechnicalUser extends PmsTechnicalUserEntityMongo {}

export const PmsTechnicalUserSchema =
  SchemaFactory.createForClass(PmsTechnicalUser);
