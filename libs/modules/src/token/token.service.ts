import { TokenConfigType } from '@lib/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService<{
      token: TokenConfigType;
    }>,
  ) {}

  public sign = (data: Object): string => {
    return jwt.sign(
      data,
      this.configService.get('token.secret', { infer: true })!,
    );
  };

  public verify = (token: string): Object => {
    return jwt.verify(
      token,
      this.configService.get('token.secret', { infer: true })!,
    );
  };
}
