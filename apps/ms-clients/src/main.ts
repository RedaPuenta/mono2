import { AppConfigType, BusExternConfigType } from '@lib/configs';
import { DocModule } from '@lib/modules';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const configService = app.get<
    ConfigService<{
      bus_extern: BusExternConfigType;
      app: AppConfigType;
    }>
  >(ConfigService);

  DocModule.register({ app, config: configService.get('app')! });

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
