import { TerminalEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'onstreet-terminals', timestamps: true })
export class Terminal extends TerminalEntityMongo {}
