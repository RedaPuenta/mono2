import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenConfig } from '@lib/configs';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      ignoreExpiration: true,
      secretOrKey: TokenConfig().secret,
    });
  }

  async validate(validateParams: any): Promise<any> {
    const mandatoryFields = ['userId'];
    const missingFields = mandatoryFields.filter((key) => !validateParams[key]);
    return missingFields.length > 0 ? false : validateParams;
  }
}
