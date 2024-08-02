import { MessagingModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { UpsModule } from '../ups/ups.module';
import { ControlUsersResolver } from './control-users.resolver';
import { ControlUsersService } from './control-users.service';

@Module({
  imports: [UpsModule, MessagingModule],
  providers: [ControlUsersService, ControlUsersResolver],
})
export class ControlUsersModule {}
