import { MessagingModule, TokenModule } from '@lib/modules';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [MessagingModule, TokenModule],
  controllers: [],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
