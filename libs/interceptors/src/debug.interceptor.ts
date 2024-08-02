import {
  CallHandler,
  ExecutionContext,
  Global,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as newrelic from 'newrelic';
import { Observable, map } from 'rxjs';

@Global()
@Injectable()
export class DebugNewrelicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responsePayload) => {
        const type = context.getType();
        const pattern = this.getServiceName(context);
        const requestPayload = this.getPayload(context);

        console.log('DEBUG LOG', {
          type,
          pattern,
          requestPayload,
          responsePayload,
        });

        try {
          newrelic.recordLogEvent({
            level: 'INFO',
            message: JSON.stringify({
              type,
              pattern,
              requestPayload,
              responsePayload,
            }),
          });
        } catch (err) {
          console.log('NEW RELIC ERROR', err);
        }

        return responsePayload;
      }),
    );
  }

  getServiceName(context: ExecutionContext) {
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

  getGraphqlServiceName(context: ExecutionContext) {
    const pattern = context.getHandler().name;
    return pattern;
  }

  getRpcServiceName(context: ExecutionContext): string {
    let pattern: string = context.switchToRpc().getContext().getSubject();
    if (pattern.includes('"cmd"'))
      pattern = pattern.replace(/.*:"(.*)"}/, '$1');
    return pattern;
  }

  getDefaultServiceName(context: ExecutionContext): string {
    const pattern = context.getHandler().name;
    return pattern;
  }

  getPayload(context: ExecutionContext) {
    const type = context.getType();

    const services: any = {
      default: this.getDefaultPayload,
      rpc: this.getRpcPayload,
      graphql: this.getGraphqlPayload,
    };

    return services[type]
      ? services[type](context)
      : services['default'](context);
  }

  getRpcPayload(context: ExecutionContext) {
    return context.switchToRpc().getData();
  }

  getGraphqlPayload(context: ExecutionContext) {
    return { todo: true };
  }

  getDefaultPayload(context: ExecutionContext) {
    const data = context.switchToHttp().getRequest();
    return data?.body;
  }
}
