import { TerminalEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TerminalsDocument = Terminal & mongoose.Document;

@Schema({ collection: 'onstreet-terminals', timestamps: true })
export class Terminal extends TerminalEntityMongo {}

export const TerminalSchema = SchemaFactory.createForClass(Terminal);
