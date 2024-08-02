import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const FpsVehicleComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class FpsVehicle {
    @StringValidator({
      context,
      required: true,
    })
    brand!: string;

    @StringValidator({
      context,
      required: false,
    })
    model?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    vehicleCategory?: string | null;
  }

  return FpsVehicle;
};

@Context({ validator: 'graphql', type: 'object' })
export class FpsVehicleComposeObjectGQL extends FpsVehicleComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class FpsVehicleComposeArgsGQL extends FpsVehicleComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class FpsVehicleComposeInputGQL extends FpsVehicleComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class FpsVehicleComposeCV extends FpsVehicleComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class FpsVehicleComposeMongo extends FpsVehicleComposeFactory({
  validator: 'mongodb',
}) {}

export const FpsVehicleComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => FpsVehicleComposeArgsGQL,
    object: () => FpsVehicleComposeObjectGQL,
    input: () => FpsVehicleComposeInputGQL,
  },
  class_validator: () => FpsVehicleComposeCV,
  mongodb: () => FpsVehicleComposeMongo,
};

export type FpsVehicleComposeType = FpsVehicleComposeCV;
