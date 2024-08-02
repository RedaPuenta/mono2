import { CryptConfigType } from '@lib/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class CryptingService {
  constructor(
    private configService: ConfigService<{
      crypt: CryptConfigType;
    }>,
  ) {}

  private key = () => {
    return crypto
      .createHash('sha512')
      .update(this.configService.get('crypt.key', { infer: true })!)
      .digest('hex')
      .substring(0, 32);
  };

  private iv = () => {
    return crypto
      .createHash('sha512')
      .update(this.configService.get('crypt.iv', { infer: true })!)
      .digest('hex')
      .substring(0, 16);
  };

  public encrypt = (data: string): string => {
    const cipher = crypto.createCipheriv(
      this.configService.get('crypt.method', { infer: true })!,
      this.key(),
      this.iv(),
    );
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    return Buffer.from(encrypted).toString('base64');
  };

  public decrypt = (data: string): string => {
    const buff = Buffer.from(data, 'base64');
    data = buff.toString('utf-8');
    const decipher = crypto.createDecipheriv(
      this.configService.get('crypt.method', { infer: true })!,
      this.key(),
      this.iv(),
    );
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  };
}
