import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MessagingModule } from '@lib/modules';

@Module({
  imports: [MessagingModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
