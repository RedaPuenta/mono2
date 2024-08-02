import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { P1000Service } from './p1000.service';
import { HashingModule, MessagingModule, UtilModule } from '@lib/modules';

@Global()
@Module({
  imports: [
    MessagingModule,
    HashingModule,
    UtilModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        timeout: 1000 * 60,
        maxRedirects: 3,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [P1000Service],
  exports: [P1000Service],
})
export class P1000Module {}
