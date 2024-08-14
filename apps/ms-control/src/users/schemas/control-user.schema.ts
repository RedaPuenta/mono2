import { ControlUserEntityMongo } from '@lib/data';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'control-users', timestamps: true })
export class ControlUser extends ControlUserEntityMongo {}
