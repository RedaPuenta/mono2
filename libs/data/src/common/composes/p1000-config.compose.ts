import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';

export const P1000ConfigComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class P1000Config {
    @StringValidator({
      context,
      required: true,
      special: {
        type: 'url',
      },
    })
    url!: string;

    @NumberValidator({
      context,
      required: true,
    })
    port!: number;

    @StringValidator({
      context,
      required: true,
    })
    path!: string;

    @StringValidator({
      context,
      required: true,
    })
    user!: string;

    @StringValidator({
      context,
      required: true,
    })
    password!: string;

    @StringValidator({
      context,
      required: true,
    })
    multisite_tag_id!: string;

    @StringValidator({
      context,
      required: true,
    })
    web2token!: string;

    @StringValidator({
      context,
      required: true,
    })
    psp!: string;

    @StringValidator({
      context,
      required: true,
    })
    tag_id!: string;

    @StringValidator({
      context,
      required: true,
    })
    tariffId!: string;

    @StringValidator({
      context,
      required: true,
    })
    legacyId!: string;
  }

  return P1000Config;
};

@Context({ validator: 'graphql', type: 'object' })
export class P1000ConfigComposeObjectGQL extends P1000ConfigComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class P1000ConfigComposeArgsGQL extends P1000ConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class P1000ConfigComposeInputGQL extends P1000ConfigComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class P1000ConfigComposeCV extends P1000ConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class P1000ConfigComposeMongo extends P1000ConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const P1000ConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => P1000ConfigComposeArgsGQL,
    object: () => P1000ConfigComposeObjectGQL,
    input: () => P1000ConfigComposeInputGQL,
  },
  class_validator: () => P1000ConfigComposeCV,
  mongodb: () => P1000ConfigComposeMongo,
};

export type P1000ConfigComposeType = P1000ConfigComposeCV;
