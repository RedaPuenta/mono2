import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import {
  ChannelComposeRule,
  ChannelComposeType,
} from '../../common/composes/channel.compose';
import { BaseGeneric } from '../../generics/base.generic';

export const ResourceEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Resource extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
    })
    tag!: string;

    @StringValidator({
      context,
      required: true,
      unique: true,
    })
    path!: string;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'url',
      },
    })
    url!: string;

    @StringValidator({
      context,
      required: true,
    })
    checksum!: string;

    @StringValidator({
      context,
      required: true,
      byDefault: 'iem',
    })
    owner!: string;

    @StringValidator({
      context,
      required: true,
    })
    bucket!: string;

    @NumberValidator({
      context,
      required: true,
      byDefault: 0,
    })
    size!: number;

    @ArrayValidator({
      context,
      required: true,
      entity: ChannelComposeRule,
    })
    channels!: Array<ChannelComposeType>;
  }

  return Resource;
};

@Context({ validator: 'graphql', type: 'object' })
export class ResourceEntityObjectGQL extends ResourceEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ResourceEntityArgsGQL extends ResourceEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ResourceEntityInputGQL extends ResourceEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ResourceEntityCV extends ResourceEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ResourceEntityMongo extends ResourceEntityFactory({
  validator: 'mongodb',
}) {}

export const ResourceEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ResourceEntityArgsGQL,
    object: () => ResourceEntityObjectGQL,
    input: () => ResourceEntityInputGQL,
  },
  class_validator: () => ResourceEntityCV,
  mongodb: () => ResourceEntityMongo,
};

export type ResourceEntityType = ResourceEntityCV;
