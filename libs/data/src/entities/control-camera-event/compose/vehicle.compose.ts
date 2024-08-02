import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const ControlCameraEventVehicleComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlCameraEventVehicle {
    @StringValidator({
      context,
      required: false,
    })
    brand?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    lpn?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    type?: string | null; //! PROBLEM_TYPE_MONGO ICI ca marche pas, essaye "typer" par exemple, ca marchera. C'est une clé bannie
  }

  return ControlCameraEventVehicle;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlCameraEventVehicleComposeObjectGQL extends ControlCameraEventVehicleComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlCameraEventVehicleComposeArgsGQL extends ControlCameraEventVehicleComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlCameraEventVehicleComposeInputGQL extends ControlCameraEventVehicleComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class ControlCameraEventVehicleComposeCV extends ControlCameraEventVehicleComposeFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class ControlCameraEventVehicleComposeMongo extends ControlCameraEventVehicleComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const ControlCameraEventVehicleComposeRule: EntityValidatorType.EntityPanel =
  {
    graphql: {
      args: () => ControlCameraEventVehicleComposeArgsGQL,
      object: () => ControlCameraEventVehicleComposeObjectGQL,
      input: () => ControlCameraEventVehicleComposeInputGQL,
    },
    class_validator: () => ControlCameraEventVehicleComposeCV,
    mongodb: () => ControlCameraEventVehicleComposeMongo,
  };

export type ControlCameraEventVehicleComposeType =
  ControlCameraEventVehicleComposeCV;
