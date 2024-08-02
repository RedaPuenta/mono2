import {
  AppConfigType,
  BusExternConfigType,
  BusInternConfigType,
} from '@lib/configs';
import { DocModule } from '@lib/modules';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<
    ConfigService<{
      bus_intern: BusInternConfigType;
      bus_extern: BusExternConfigType;
      app: AppConfigType;
    }>
  >(ConfigService);

  app.use(helmet());
  app.use(morgan('combined'));

  DocModule.register({ app, config: configService.get('app')! });

  if (configService.get('app.env', { infer: true })! !== 'local') {
    app.connectMicroservice<MicroserviceOptions>(
      configService.get('bus_intern')!,
      {
        inheritAppConfig: true,
      },
    );
  }

  app.connectMicroservice<MicroserviceOptions>(
    configService.get('bus_extern')!,
    {
      inheritAppConfig: true,
    },
  );
  await app.startAllMicroservices();
  await app.listen(configService.get('app.port', { infer: true })!);
}
bootstrap();
