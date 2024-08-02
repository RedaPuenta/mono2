import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const cmd = context.getArgByIndex(1);

    console.log('----- Before Ms Call -----', cmd);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `----- After Ms call (${Date.now() - now} ms) -----`,
            cmd,
          ),
        ),
      );
  }
}
