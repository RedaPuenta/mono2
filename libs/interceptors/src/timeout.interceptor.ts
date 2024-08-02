import { AppConfigType } from '@lib/configs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(timeout(this.configService.get('app.timeout', { infer: true })!));
  }
}
