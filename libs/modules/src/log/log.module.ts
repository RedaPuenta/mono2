import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogConfig, LogConfigEnv } from '@lib/configs/src/log.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ ...LogConfigEnv, load: [LogConfig] })],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
