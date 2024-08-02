import { TokenConfig, TokenConfigEnv } from '@lib/configs';
import { JWTStrategy, AccessTokenStrategy } from '@lib/strategys';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule.forRoot({ ...TokenConfigEnv, load: [TokenConfig] }),
    JwtModule.register({
      secret: TokenConfig().secret,
      signOptions: { expiresIn: TokenConfig().duration },
    }),
    PassportModule,
  ],
  providers: [TokenService, AccessTokenStrategy, JWTStrategy],
  exports: [TokenService],
})
export class TokenModule {}
