import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const ShapeComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Shape {
    @StringValidator({
      context,
      required: true,
    })
    type!: string;

    @ArrayValidator({
      context,
      required: false,
      entity: () => [Number] as any,
    })
    coordinates?: Array<[number]> | null;
  }

  return Shape;
};

@Context({ validator: 'graphql', type: 'object' })
export class ShapeComposeObjectGQL extends ShapeComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ShapeComposeArgsGQL extends ShapeComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ShapeComposeInputGQL extends ShapeComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ShapeComposeCV extends ShapeComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ShapeComposeMongo extends ShapeComposeFactory({
  validator: 'mongodb',
}) {}

export const ShapeComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ShapeComposeArgsGQL,
    object: () => ShapeComposeObjectGQL,
    input: () => ShapeComposeInputGQL,
  },
  class_validator: () => ShapeComposeCV,
  mongodb: () => ShapeComposeMongo,
};

export type ShapeComposeType = ShapeComposeCV;
