import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';
import { ControlCameraPositionEnum } from './enum/control-camera-position.enum';

export const ControlCameraEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlCamera extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      unique: true,
      trim: true,
    })
    code!: string;

    @StringValidator({
      context,
      required: true,
      enumeration: ControlCameraPositionEnum,
    })
    position!: ControlCameraPositionEnum;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    ups!: string;

    @StringValidator({
      context,
      required: false,
    })
    description?: string | null;
  }

  return ControlCamera;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlCameraEntityObjectGQL extends ControlCameraEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlCameraEntityArgsGQL extends ControlCameraEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlCameraEntityInputGQL extends ControlCameraEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ControlCameraEntityCV extends ControlCameraEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ControlCameraEntityMongo extends ControlCameraEntityFactory({
  validator: 'mongodb',
}) {}

export const ControlCameraEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlCameraEntityArgsGQL,
    object: () => ControlCameraEntityObjectGQL,
    input: () => ControlCameraEntityInputGQL,
  },
  class_validator: () => ControlCameraEntityCV,
  mongodb: () => ControlCameraEntityMongo,
};

export type ControlCameraEntityType = ControlCameraEntityCV;
