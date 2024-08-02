import { ControlUserEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ControlUserDocument = ControlUser & mongoose.Document;

@Schema({ collection: 'control-users', timestamps: true })
export class ControlUser extends ControlUserEntityMongo {}

export const ControlUserSchema = SchemaFactory.createForClass(ControlUser);
