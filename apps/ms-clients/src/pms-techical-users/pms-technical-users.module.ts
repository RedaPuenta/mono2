import { MongoModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { PmsTechnicalUsersController } from './pms-technical-users.controller';
import { PmsTechnicalUsersService } from './pms-technical-users.service';
import {
  PmsTechnicalUser,
  PmsTechnicalUserSchema,
} from './schemas/pms-technical-user.schema';

@Module({
  imports: [
    MongoModule.collection([
      { name: PmsTechnicalUser.name, schema: PmsTechnicalUserSchema },
    ]),
  ],
  controllers: [PmsTechnicalUsersController],
  providers: [PmsTechnicalUsersService],
})
export class PmsTechnicalUsersModule {}
