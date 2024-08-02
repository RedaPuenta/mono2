import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { ControlUser, ControlUserSchema } from './schemas/control-user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongoModule.collection([
      { name: ControlUser.name, schema: ControlUserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
