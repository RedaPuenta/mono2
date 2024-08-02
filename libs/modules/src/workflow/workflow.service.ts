import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { SagaProcessor, SagaResponse } from 'yoonite-saga';
import { AppConfigType } from '../../../configs';
import { appRegistry } from '../../../registrys';
import { LogService } from '../log/log.service';

@Injectable()
export class WorkflowService {
  constructor(
    private logService: LogService,
    private configService: ConfigService<{
      app: AppConfigType;
    }>,
    @Inject('FLOWS') private flows: any[],
  ) {}

  async run<T>(ctx: any, steps: Array<any>): Promise<SagaResponse<T>> {
    const promises = steps.map((Step) => {
      return Object.entries(this.flows)
        .find(([key]: any) => key === Step.name)![1] //! ERROR GESTION
        .build(ctx);
    });

    const workflows = await Promise.all(promises);

    const processor = new SagaProcessor<T>();

    processor.handleExceptions((error: unknown) => {
      if (error instanceof RpcException) {
        return error;
      } else if (error instanceof Error) {
        return new RpcException({
          code: `${
            appRegistry[this.configService.get('app.name', { infer: true })!]
              .code
          }_666`,
          message: error.message,
          payload: {},
        });
      }
    });

    workflows.forEach((workflow) => processor.add(workflow));
    const response = await processor.start();

    const { state, context, errors, history } = response;

    if (state === 'failed') {
      this.logService.error({
        message: 'WORFLOW ERROR',
        payload: {
          state,
          errors,
          lastStep: history[history.length - 1],
        },
      });
    }

    return response;
  }
}
