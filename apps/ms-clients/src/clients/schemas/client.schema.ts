import { ClientEntityMongo } from '@lib/data/src/entities/client/client.entity';
import { Schema } from '@nestjs/mongoose';

@Schema({ collection: 'onstreet-clients', timestamps: true })
export class Client extends ClientEntityMongo {}
