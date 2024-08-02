import { MessagingModule } from '@lib/modules';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';

@Module({
  imports: [
    MessagingModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get('httpConfig')!,
      inject: [ConfigService],
    }),
  ],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
