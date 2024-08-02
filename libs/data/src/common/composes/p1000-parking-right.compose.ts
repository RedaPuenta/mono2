import {
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';

export const P1000ParkingRightComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class P1000ParkingRight {
    @StringValidator({
      context,
      required: true,
    })
    zoneId!: string;

    @StringValidator({
      context,
      required: true,
    })
    cityId!: string;

    @StringValidator({
      context,
      required: true,
    })
    parkId!: string;

    @StringValidator({
      context,
      required: true,
    })
    fineLegalId!: string;

    @StringValidator({
      context,
      required: true,
    })
    rootFineLegalId!: string;

    @StringValidator({
      context,
      required: true,
    })
    type!: string;

    @NumberValidator({
      context,
      required: true,
    })
    rightPrice!: number;

    @DateValidator({
      context,
      required: true,
    })
    startDatetime!: string;

    @DateValidator({
      context,
      required: true,
    })
    endDatetime!: string;

    @StringValidator({
      context,
      required: true,
    })
    pointOfSaleId!: string;

    @StringValidator({
      context,
      required: true,
    })
    P1000parkingRightId!: string;
  }

  return P1000ParkingRight;
};

@Context({ validator: 'graphql', type: 'object' })
export class P1000ParkingRightComposeObjectGQL extends P1000ParkingRightComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class P1000ParkingRightComposeArgsGQL extends P1000ParkingRightComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class P1000ParkingRightComposeInputGQL extends P1000ParkingRightComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class P1000ParkingRightComposeCV extends P1000ParkingRightComposeFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class P1000ParkingRightComposeMongo extends P1000ParkingRightComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const P1000parkingRightComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => P1000ParkingRightComposeArgsGQL,
    object: () => P1000ParkingRightComposeObjectGQL,
    input: () => P1000ParkingRightComposeInputGQL,
  },
  class_validator: () => P1000ParkingRightComposeCV,
  mongodb: () => P1000ParkingRightComposeMongo,
};

export type P1000ParkingRightComposeType = P1000ParkingRightComposeCV;
