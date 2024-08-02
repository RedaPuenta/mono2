import { Module } from '@nestjs/common';
import { DevtoolsService } from './devtools.service';
import { DevtoolsModule as DevtoolsModuleNest } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModuleNest.register({
      http: true,
      port: 8081,
    }),
  ],
  providers: [DevtoolsService],
  exports: [DevtoolsService],
})
export class DevtoolsModule {}
