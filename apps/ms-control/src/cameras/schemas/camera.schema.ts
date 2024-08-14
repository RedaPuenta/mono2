import { ControlCameraEntityMongo } from '@lib/data';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'control-cameras', timestamps: true })
export class Camera extends ControlCameraEntityMongo {}
