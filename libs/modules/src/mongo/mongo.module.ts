import { MongoConfig, MongoConfigEnv, MongoConfigType } from '@lib/configs';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';

@Module({})
export class MongoModule extends MongooseModule {
  static connect(): DynamicModule {
    return {
      ...super.forRootAsync({
        imports: [
          ConfigModule.forRoot({ ...MongoConfigEnv, load: [MongoConfig] }),
        ],
        useFactory: async (
          config: ConfigService<{
            mongo: MongoConfigType;
          }>,
        ) => ({
          uri: config.get('mongo.uri', { infer: true }),
          autoIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        inject: [ConfigService],
      }),
    };
  }

  // public static collection(params: any): DynamicModule {
  //   return {
  //     ...super.forFeature(params),
  //   };
  // }

  public static collection(
    schemas: Array<{
      new (...args: any[]): any;
    }>,
  ): DynamicModule {
    return {
      ...super.forFeatureAsync(
        schemas.map((item) => ({
          name: item.name,
          imports: [
            ConfigModule.forRoot({ ...MongoConfigEnv, load: [MongoConfig] }),
            LogModule,
          ],
          inject: [ConfigService, LogService],
          useFactory: (
            configService: ConfigService,
            logService: LogService,
          ) => {
            const buildSchema = SchemaFactory.createForClass(item);
            buildSchema.pre('save', function () {
              logService.debug({ message: 'Before save data' });
            });
            return buildSchema;
          },
        })),
      ),
    };
  }
}
