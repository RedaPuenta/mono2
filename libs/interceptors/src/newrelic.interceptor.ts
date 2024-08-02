import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import newrelic from 'newrelic';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfigType } from '../../configs';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.configService.get('app.env', { infer: true })! === 'local')
      return next.handle();

    const type = context.getType();
    const pattern = this.getServiceName(context);

    return newrelic.startBackgroundTransaction(pattern, type, () => {
      const transaction = newrelic.getTransaction();
      return next.handle().pipe(tap(() => transaction.end()));
    });
  }

  private getServiceName(context: ExecutionContext) {
    const type = context.getType();

    const services: any = {
      default: this.getDefaultServiceName,
      rpc: this.getRpcServiceName,
      graphql: this.getGraphqlServiceName,
    };

    return services[type]
      ? services[type](context)
      : services['default'](context);
  }

  private getGraphqlServiceName(context: ExecutionContext) {
    const pattern = context.getHandler().name;
    return pattern;
  }

  private getRpcServiceName(context: ExecutionContext): string {
    let pattern: string = context.switchToRpc().getContext().getSubject();
    if (pattern.includes('"cmd"'))
      pattern = pattern.replace(/.*:"(.*)"}/, '$1');
    return pattern;
  }

  private getDefaultServiceName(context: ExecutionContext): string {
    const pattern = context.getHandler().name;
    return pattern;
  }
}
