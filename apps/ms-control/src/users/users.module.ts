import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ControlUser } from './schemas/control-user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongoModule.collection([ControlUser])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
