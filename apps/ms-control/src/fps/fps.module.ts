import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { FpsController } from './fps.controller';
import { FpsService } from './fps.service';
import { Fps } from './schemas/fps.schema';

@Module({
  imports: [MongoModule.collection([Fps])],
  providers: [FpsService],
  controllers: [FpsController],
})
export class FpsModule {}
