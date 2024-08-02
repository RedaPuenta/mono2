import {
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const PictureComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Picture {
    @StringValidator({
      context,
      required: false,
    })
    data!: string | null;

    @StringValidator({
      context,
      required: false,
    })
    mimeType?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    pictureName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    description?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    pictureDatetime?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    contentURL?: string | null;
  }

  return Picture;
};

@Context({ validator: 'graphql', type: 'object' })
export class PictureComposeObjectGQL extends PictureComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class PictureComposeArgsGQL extends PictureComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class PictureComposeInputGQL extends PictureComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class PictureComposeCV extends PictureComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class PictureComposeMongo extends PictureComposeFactory({
  validator: 'mongodb',
}) {}

export const PictureComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => PictureComposeArgsGQL,
    object: () => PictureComposeObjectGQL,
    input: () => PictureComposeInputGQL,
  },
  class_validator: () => PictureComposeCV,
  mongodb: () => PictureComposeMongo,
};

export type PictureComposeType = PictureComposeCV;
