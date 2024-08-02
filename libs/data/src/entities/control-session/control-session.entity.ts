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
import {
  P1000ParkingRightComposeType,
  P1000parkingRightComposeRule,
} from '../../common/composes/p1000-parking-right.compose';
import { BaseGeneric } from '../../generics/base.generic';
import {
  ControlContextComposeRule,
  ControlContextComposeType,
} from './compose/control-context.compose';
import { CoverComposeRule, CoverComposeType } from './compose/cover.compose';
import {
  HealthSummaryComposeRule,
  HealthSummaryComposeType,
} from './compose/health-summary.compose';
import { ControlCameraStateEnum } from './enum/control-session-state.enum';

export const ControlSessionEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlSession extends BaseGeneric(context) {
    @DateValidator({
      context,
      required: true,
    })
    startDate!: string;

    @DateValidator({
      context,
      required: false,
    })
    endDate?: string | null;

    @StringValidator({
      context,
      required: true,
      byDefault: 'UNDEFINED',
      enumeration: ControlCameraStateEnum,
    })
    controlState!: ControlCameraStateEnum | null;

    @BooleanValidator({
      context,
      required: true,
      byDefault: true,
    })
    isExposed!: boolean;

    @StringValidator({
      context,
      required: true,
      index: true,
    })
    lpn!: string;

    @StringValidator({
      context,
      required: true,
      index: true,
      special: {
        type: 'mongoId',
      },
    })
    upsId!: string;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    entryEventId!: string;

    @StringValidator({
      context,
      required: false,
      special: {
        type: 'mongoId',
      },
    })
    exitEventId?: string | null;

    @ArrayValidator({
      context,
      required: false,
      entity: CoverComposeRule,
    })
    covers?: Array<CoverComposeType> | null;

    @EntityValidator({
      context,
      required: false,
      entity: ControlContextComposeRule,
    })
    controlCtx?: ControlContextComposeType | null;

    @ArrayValidator({
      context,
      required: false,
      entity: ChannelComposeRule,
    })
    channels?: Array<ChannelComposeType> | null;

    @NumberValidator({
      context,
      required: false,
      byDefault: 0,
    })
    uncoveredDuration?: number | null;

    @NumberValidator({
      context,
      required: false,
      byDefault: 0,
    })
    rightsDuration?: number | null;

    @EntityValidator({
      context,
      required: false,
      entity: HealthSummaryComposeRule,
    })
    healthSummary?: HealthSummaryComposeType | null;

    @ArrayValidator({
      context,
      required: false,
      entity: P1000parkingRightComposeRule,
    })
    significantRights?: Array<P1000ParkingRightComposeType> | null;
  }

  return ControlSession;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlSessionEntityObjectGQL extends ControlSessionEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlSessionEntityArgsGQL extends ControlSessionEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlSessionEntityInputGQL extends ControlSessionEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ControlSessionEntityCV extends ControlSessionEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ControlSessionEntityMongo extends ControlSessionEntityFactory({
  validator: 'mongodb',
}) {}

export const ControlSessionEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlSessionEntityArgsGQL,
    object: () => ControlSessionEntityObjectGQL,
    input: () => ControlSessionEntityInputGQL,
  },
  class_validator: () => ControlSessionEntityCV,
  mongodb: () => ControlSessionEntityMongo,
};

export type ControlSessionEntityType = ControlSessionEntityCV;
