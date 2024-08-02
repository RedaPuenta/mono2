import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const ChannelComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Channel {
    @StringValidator({
      context,
      required: true,
    })
    _id!: string;

    @StringValidator({
      context,
      required: true,
    })
    channel!: string;
  }

  return Channel;
};

@Context({ validator: 'graphql', type: 'object' })
export class ChannelComposeObjectGQL extends ChannelComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ChannelComposeArgsGQL extends ChannelComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ChannelComposeInputGQL extends ChannelComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ChannelComposeCV extends ChannelComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ChannelComposeMongo extends ChannelComposeFactory({
  validator: 'mongodb',
}) {}

export const ChannelComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ChannelComposeArgsGQL,
    object: () => ChannelComposeObjectGQL,
    input: () => ChannelComposeInputGQL,
  },
  class_validator: () => ChannelComposeCV,
  mongodb: () => ChannelComposeMongo,
};

export type ChannelComposeType = ChannelComposeCV;
