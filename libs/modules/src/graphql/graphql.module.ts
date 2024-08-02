import {
  GraphQLConfig,
  GraphQLConfigEnv,
  GraphQLConfigType,
} from '@lib/configs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule as GraphQLModuleNest } from '@nestjs/graphql';
import { join } from 'path';

@Module({})
export class GraphQLModule {
  static forRoot({ include }: { include: Function[] }): DynamicModule {
    return {
      module: GraphQLModule,
      imports: [
        ConfigModule.forRoot({ ...GraphQLConfigEnv, load: [GraphQLConfig] }),
        GraphQLModuleNest.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          useFactory: (
            config: ConfigService<{ graphql: GraphQLConfigType }>,
          ) => {
            return {
              include,
              introspection: true,
              autoSchemaFile: join(process.cwd(), 'schema.gql'),
              playground:
                config.get('graphql.env', { infer: true }) !== 'production',
              autoTransformHttpErrors: false,
              includeStacktraceInErrorResponses: false,
              formatError: (error) => {
                return error;
              },
            };
          },
          inject: [ConfigService],
        }),
        ...(include as any[]),
      ],
    };
  }
}
