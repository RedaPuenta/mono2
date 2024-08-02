import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigEnv, AppConfigType } from '../../../configs';
import { CommonModule } from '../common/common.module';
import { LogModule } from '../log/log.module';
import { WorkflowService } from './workflow.service';
import { CreateFpsModule } from '../../../../apps/api-control/src/common/flows/create-fps/create-fps.module';

@Module({})
export class WorkflowModule {
  static register({
    appConfig,
    includes,
  }: {
    appConfig: () => AppConfigType;
    includes: any[];
  }): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        ConfigModule.forRoot({
          ...AppConfigEnv,
          isGlobal: true,
          load: [appConfig],
        }),
        LogModule,
        ...includes,
      ],
      providers: [
        WorkflowService,
        {
          provide: 'FLOWS',
          useFactory: (...providers) => {
            const workflowMap: Record<string, any> = {};
            providers.forEach((provider: any) => {
              const className: string = provider.constructor.name;
              workflowMap[className] = provider;
            });
            return workflowMap;
          },
          inject: includes.flatMap((el) =>
            Reflect.getMetadata('providers', el),
          ),
        },
      ],
      exports: [WorkflowService],
    };
  }
}
