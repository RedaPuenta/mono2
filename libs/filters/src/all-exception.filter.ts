import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appRegistry } from '../../registrys';
import { AppConfigType } from '../../configs';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log('EXCEPTION', exception);
    const error = this.translateExceptionToError(exception, host);
    this.handleErrorHost(error, host);
  }

  private get appCode() {
    return appRegistry[this.configService.get('app.name', { infer: true })!]
      .code;
  }

  protected translateExceptionToError(exception: any, host: any) {
    return exception instanceof RpcException
      ? exception.getError()
      : { code: `${this.appCode}_666`, message: exception.message };
  }

  private handleErrorHost(error: any, host: any) {
    if (host.getType() === 'http') this.httpError(host, error);
    else if (host.getType() === 'rpc') this.rpcError(host, error);
    else this.graphqlError(host, error);
  }

  private rpcError(host: ArgumentsHost, error: any) {
    const subject = this.getRpcSubject(host);
    const { code, message, pattern = subject, payload = {} } = error;
    throw new RpcException({ code, message, pattern, payload });
  }

  private httpError(host: ArgumentsHost, error: any) {
    const { code, message, pattern, payload } = error;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(500).json({ error: { code, message, pattern, payload } });
  }

  private graphqlError(host: ArgumentsHost, error: any) {
    const { code, message, pattern, payload } = error;
    throw new GraphQLError(code, {
      extensions: { code, message, pattern, payload },
    });
  }

  private getRpcSubject(host: ArgumentsHost) {
    const rpcHost = host.switchToRpc();
    const ctx = rpcHost.getContext();
    const subject = ctx.getSubject().match(/\{"cmd":"(.*)"\}/);
    return subject[1] || ctx.getSubject();
  }
}
