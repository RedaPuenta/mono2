import { AppConfigType } from '@lib/configs';
import { DynamicModule, INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class DocModule {
  static register({
    app,
    config,
  }: {
    app: INestApplication;
    config: AppConfigType;
  }): DynamicModule {
    SwaggerModule.setup(
      'api',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder().setTitle(config.name).build(),
      ),
    );

    return {
      module: DocModule,
    };
  }
}
