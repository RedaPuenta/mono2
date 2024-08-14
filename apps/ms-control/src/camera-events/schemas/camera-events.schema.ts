import { ControlCameraEventEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({
  collection: 'control-camera-events',
  timestamps: true,
})
export class CameraEvent extends ControlCameraEventEntityMongo {}
