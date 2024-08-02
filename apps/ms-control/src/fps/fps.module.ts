import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { FpsController } from './fps.controller';
import { FpsService } from './fps.service';
import { Fps, FpsSchema } from './schemas/fps.schema';

@Module({
  imports: [MongoModule.collection([{ name: Fps.name, schema: FpsSchema }])],
  providers: [FpsService],
  controllers: [FpsController],
})
export class FpsModule {}
