import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import {
  AddressComposeRule,
  AddressComposeType,
} from '../../common/composes/address.compose';
import {
  P1000ParkingRightComposeType,
  P1000parkingRightComposeRule,
} from '../../common/composes/p1000-parking-right.compose';
import { NotificationAuthorityEnum } from '../../common/enum/notification-authority.enum';
import { BaseGeneric } from '../../generics/base.generic';
import {
  ControlAgentComposeRule,
  ControlAgentComposeType,
} from './compose/agent.compose';
import {
  LicensePlateComposeRule,
  LicensePlateComposeType,
} from './compose/license-plate.compose';
import {
  RecoursOrganizationComposeRule,
  RecoursOrganizationComposeType,
} from './compose/recours-organization.compose';
import {
  StatementLocationComposeRule,
  StatementLocationComposeType,
} from './compose/statement-location.compose';
import {
  UserDetailsComposeRule,
  UserDetailsComposeType,
} from './compose/user-details.compose';
import {
  FpsVehicleComposeRule,
  FpsVehicleComposeType,
} from './compose/vehicle.compose';
import { FPSPaymentStatusEnum } from './enum/fps-payment-status.enum';
import { FPSTypeEnum } from './enum/fps-type.enum';

export const FpsEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Fps extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    upsId!: string;

    @StringValidator({
      context,
      required: true,
    })
    fineId!: string;

    @StringValidator({
      context,
      required: true,
    })
    fineLegalId!: string;

    @StringValidator({
      context,
      required: true,
      enumeration: FPSTypeEnum,
    })
    type!: FPSTypeEnum;

    @StringValidator({
      context,
      required: true,
    })
    rootFineLegalId!: string;

    @StringValidator({
      context,
      required: false,
    })
    parent?: string | null;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'jwt',
      },
    })
    authId!: string;

    @EntityValidator({
      context,
      required: true,
      entity: ControlAgentComposeRule,
    })
    agent!: ControlAgentComposeType;

    @StringValidator({
      context,
      required: true,
    })
    cityId!: string;

    @StringValidator({
      context,
      required: true,
    })
    terminalId!: string;

    @EntityValidator({
      context,
      required: true,
      entity: LicensePlateComposeRule,
    })
    licensePlate!: LicensePlateComposeType;

    @EntityValidator({
      context,
      required: true,
      entity: FpsVehicleComposeRule,
    })
    vehicle!: FpsVehicleComposeType;

    @StringValidator({
      context,
      required: true,
    })
    zoneId!: string;

    @StringValidator({
      context,
      required: false,
    })
    parkId?: string | null;

    @DateValidator({
      context,
      required: true,
    })
    statementDatetime!: string;

    @EntityValidator({
      context,
      required: true,
      entity: AddressComposeRule,
    })
    statementAddress!: AddressComposeType;

    @EntityValidator({
      context,
      required: true,
      entity: StatementLocationComposeRule,
    })
    statementLocation!: StatementLocationComposeType;

    @StringValidator({
      context,
      required: true,
      enumeration: NotificationAuthorityEnum,
    })
    notificationAuthority!: NotificationAuthorityEnum;

    @DateValidator({
      context,
      required: false,
    })
    authTransfertDatetime?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    notificationDatetime?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    dateModified?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    validityDatetime?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    reducedDatetime?: string | null;

    @NumberValidator({
      context,
      required: true,
    })
    finePrice!: number;

    @NumberValidator({
      context,
      required: false,
    })
    surcharge?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    reducedFinePrice?: number | null;

    @NumberValidator({
      context,
      required: false,
    })
    reducedPriceDuration?: number | null;

    @StringValidator({
      context,
      required: false,
      enumeration: FPSPaymentStatusEnum,
    })
    paymentStatus?: FPSPaymentStatusEnum | null;

    @EntityValidator({
      context,
      required: true,
      entity: RecoursOrganizationComposeRule,
    })
    recourseOrganization!: RecoursOrganizationComposeType;

    @EntityValidator({
      context,
      required: false,
      entity: UserDetailsComposeRule,
    })
    offender?: UserDetailsComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: UserDetailsComposeRule,
    })
    representative?: UserDetailsComposeType | null;

    @StringValidator({
      context,
      required: false,
    })
    comment?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    cancelledResponse?: string | null;

    @ArrayValidator({
      context,
      required: false,
      entity: P1000parkingRightComposeRule,
    })
    significantRights?: P1000ParkingRightComposeType | null;
  }

  return Fps;
};

@Context({ validator: 'graphql', type: 'object' })
export class FpsEntityObjectGQL extends FpsEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class FpsEntityArgsGQL extends FpsEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class FpsEntityInputGQL extends FpsEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class FpsEntityCV extends FpsEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class FpsEntityMongo extends FpsEntityFactory({
  validator: 'mongodb',
}) {}

export const FpsEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => FpsEntityArgsGQL,
    object: () => FpsEntityObjectGQL,
    input: () => FpsEntityInputGQL,
  },
  class_validator: () => FpsEntityCV,
  mongodb: () => FpsEntityMongo,
};

export type FpsEntityType = FpsEntityCV;
