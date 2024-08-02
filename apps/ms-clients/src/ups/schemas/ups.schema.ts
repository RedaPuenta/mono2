import { UpsEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UpsDocument = Ups & mongoose.Document;

@Schema({ collection: 'onstreet-ups', timestamps: true })
export class Ups extends UpsEntityMongo {}

export const UpsSchema = SchemaFactory.createForClass(Ups);
