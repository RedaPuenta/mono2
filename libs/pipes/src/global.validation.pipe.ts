import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from '../../configs';
import { appRegistry } from '../../registrys';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
  ) {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        throw new RpcException({
          code: `${
            appRegistry[this.configService.get('app.name', { infer: true })!]
              .code
          }_111`,
          message: `Validators exception`,
          payload: { errors },
        });
      },
    });
  }
}
