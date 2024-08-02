import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { HashConfig, HashConfigEnv } from '@lib/configs';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({ ...HashConfigEnv, load: [HashConfig] })],
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
