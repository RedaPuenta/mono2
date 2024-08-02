import { ControlSessionEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'control-sessions', timestamps: true, autoCreate: true })
export class ControlSession extends ControlSessionEntityMongo {}
