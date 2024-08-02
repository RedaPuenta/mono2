import {
  ArrayValidator,
  BooleanValidator,
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import {
  ChannelComposeRule,
  ChannelComposeType,
} from '../../common/composes/channel.compose';
import { BaseGeneric } from '../../generics/base.generic';
import {
  ControlCameraEventVehicleComposeRule,
  ControlCameraEventVehicleComposeType,
} from './compose/vehicle.compose';
import { ControlCameraEventWayEnum } from './enum/control-camera-event-way.enum';

export const ControlCameraEventEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlCameraEvent extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    cameraId!: string;

    @BooleanValidator({
      context,
      required: false,
    })
    isVehicle?: boolean | null;

    @BooleanValidator({
      context,
      required: false,
    })
    knownLpn?: boolean | null;

    @StringValidator({
      context,
      required: true,
      enumeration: ControlCameraEventWayEnum,
    })
    way!: ControlCameraEventWayEnum;

    @NumberValidator({
      context,
      required: false,
    })
    confidence?: number | null;

    @DateValidator({
      context,
      required: false,
      byDefault: () => new Date(),
    })
    happenedAt?: string;

    @EntityValidator({
      context,
      required: true,
      entity: ControlCameraEventVehicleComposeRule,
    })
    vehicle!: ControlCameraEventVehicleComposeType;

    @BooleanValidator({
      context,
      required: false,
      byDefault: false,
    })
    hasSubscription?: boolean | null;

    @BooleanValidator({
      context,
      required: false,
      byDefault: false,
    })
    hasParkingRight?: boolean | null;

    @ArrayValidator({
      context,
      required: false,
      entity: () => String as any,
      //! ID
    })
    resources?: Array<string> | null;

    @ArrayValidator({
      context,
      required: false,
      entity: ChannelComposeRule,
      index: true,
    })
    channels?: Array<ChannelComposeType> | null;
  }

  return ControlCameraEvent;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlCameraEventEntityObjectGQL extends ControlCameraEventEntityFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlCameraEventEntityArgsGQL extends ControlCameraEventEntityFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlCameraEventEntityInputGQL extends ControlCameraEventEntityFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class ControlCameraEventEntityCV extends ControlCameraEventEntityFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class ControlCameraEventEntityMongo extends ControlCameraEventEntityFactory(
  {
    validator: 'mongodb',
  },
) {}

export const ControlCameraEventEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlCameraEventEntityArgsGQL,
    object: () => ControlCameraEventEntityObjectGQL,
    input: () => ControlCameraEventEntityInputGQL,
  },
  class_validator: () => ControlCameraEventEntityCV,
  mongodb: () => ControlCameraEventEntityMongo,
};

export type ControlCameraEventEntityType = ControlCameraEventEntityCV;
