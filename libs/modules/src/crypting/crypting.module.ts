import { CryptConfig, CryptConfigEnv } from '@lib/configs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptingService } from './crypting.service';

@Module({
  imports: [ConfigModule.forRoot({ ...CryptConfigEnv, load: [CryptConfig] })],
  providers: [CryptingService],
  exports: [CryptingService],
})
export class CryptingModule {}
