import { ClientEntityMongo } from '@lib/data/src/entities/client/client.entity';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ClientsDocument = Client & mongoose.Document;

@Schema({ collection: 'onstreet-clients', timestamps: true })
export class Client extends ClientEntityMongo {}

export const ClientSchema = SchemaFactory.createForClass(Client);
