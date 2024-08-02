import { ControlCameraEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CameraDocument = Camera & mongoose.Document;

@Schema({ collection: 'control-cameras', timestamps: true })
export class Camera extends ControlCameraEntityMongo {}

export const CameraSchema = SchemaFactory.createForClass(Camera);
