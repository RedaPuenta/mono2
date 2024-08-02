import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenConfig } from '../../configs';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: TokenConfig().secret,
    });
  }

  async validate(validateParams: any) {
    const mandatoryFields = ['appKey', 'appName', 'appVersion'];
    const missingFields = mandatoryFields.filter((key) => !validateParams[key]);
    return missingFields.length > 0 ? false : validateParams;
  }
}
