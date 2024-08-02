import { ControlSessionEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'control-sessions', timestamps: true, autoCreate: true })
export class ControlSession extends ControlSessionEntityMongo {}

export const ControlSessionSchema =
  SchemaFactory.createForClass(ControlSession);
