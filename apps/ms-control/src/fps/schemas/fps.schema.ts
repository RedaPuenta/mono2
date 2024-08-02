import { FpsEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'fps', timestamps: true })
export class Fps extends FpsEntityMongo {}

export const FpsSchema = SchemaFactory.createForClass(Fps);
