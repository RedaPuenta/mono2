import { ControlCameraEventEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'control-camera-events',
  timestamps: true,
})
export class CameraEvent extends ControlCameraEventEntityMongo {}

export const EventSchema = SchemaFactory.createForClass(CameraEvent);
