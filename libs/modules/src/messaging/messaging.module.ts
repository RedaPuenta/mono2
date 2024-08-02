import {
  BusExternConfig,
  BusExternConfigEnv,
  BusExternConfigType,
  BusInternConfig,
  BusInternConfigEnv,
  BusInternConfigType,
} from '@lib/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MessagingService } from './messaging.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HashingModule } from '../hashing/hashing.module';

@Module({
  imports: [
    HashingModule,
    CacheModule.register(),
    ConfigModule.forRoot({
      ...BusInternConfigEnv,
      isGlobal: true,
      load: [BusInternConfig],
    }),
    ConfigModule.forRoot({
      ...BusExternConfigEnv,
      isGlobal: true,
      load: [BusExternConfig],
    }),
    ClientsModule.registerAsync([
      {
        name: 'BUS_INTERN',
        imports: [ConfigModule],
        useFactory: async (
          config: ConfigService<{
            bus_intern: BusInternConfigType;
          }>,
        ) => config.get('bus_intern')!,
        inject: [ConfigService],
      },
      {
        name: 'BUS_EXTERN',
        imports: [ConfigModule],
        useFactory: async (
          config: ConfigService<{
            bus_extern: BusExternConfigType;
          }>,
        ) => config.get('bus_extern')!,
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
