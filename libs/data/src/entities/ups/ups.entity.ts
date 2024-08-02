import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
  UnknownValidator,
} from '@lib/decorators';
import {
  AddressComposeRule,
  AddressComposeType,
} from '../../common/composes/address.compose';
import {
  ShapeComposeRule,
  ShapeComposeType,
} from '../../common/composes/shape.compose';
import {
  TranslationComposeRule,
  TranslationComposeType,
} from '../../common/composes/translation.compose';
import { BaseGeneric } from '../../generics/base.generic';
import {
  GlobalConfigComposeRule,
  GlobalConfigComposeType,
} from '../../common/composes/global-config.compose';

export const UpsEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Ups extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      index: true,
      special: {
        type: 'mongoId',
      },
    })
    clientId!: string;

    @StringValidator({
      context,
      required: true,
      index: true,
      unique: true,
      trim: true,
      formalize: 'lowercase',
    })
    code!: string;

    @StringValidator({
      context,
      required: false,
      index: true,
      byDefault: 'PARK',
    })
    type?: string | null;

    @NumberValidator({
      context,
      required: false,
      index: true,
      byDefault: 0,
    })
    maximumDuration?: number | null;

    @ArrayValidator({
      context,
      required: false,
      entity: TranslationComposeRule,
    })
    translation?: Array<TranslationComposeType> | null;

    @ArrayValidator({
      context,
      required: true,
      entity: () => Number as any,
    })
    center!: Array<number>;

    @EntityValidator({
      context,
      required: true,
      entity: ShapeComposeRule,
    })
    shape!: ShapeComposeType;

    @StringValidator({
      context,
      required: false,
      special: {
        type: 'color',
        format: 'hexa',
      },
    })
    shapeColor?: string | null;

    @EntityValidator({
      context,
      required: false,
      entity: AddressComposeRule,
    })
    address?: AddressComposeType | null;

    @StringValidator({
      context,
      required: false,
    })
    externalUpsId?: string | null;

    @EntityValidator({
      context,
      required: false,
      entity: GlobalConfigComposeRule,
    })
    config?: GlobalConfigComposeType | null;

    @UnknownValidator({
      context,
      required: false,
      byDefault: {},
    })
    payload?: unknown | null;

    @NumberValidator({
      context,
      required: false,
      index: true,
      byDefault: 0,
    })
    occupancy?: number | null;

    @NumberValidator({
      context,
      required: false,
      index: true,
      byDefault: 0,
    })
    capacity?: number | null;
  }

  return Ups;
};

@Context({ validator: 'graphql', type: 'object' })
export class UpsEntityObjectGQL extends UpsEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class UpsEntityArgsGQL extends UpsEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class UpsEntityInputGQL extends UpsEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class UpsEntityCV extends UpsEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class UpsEntityMongo extends UpsEntityFactory({
  validator: 'mongodb',
}) {}

export const UpsEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => UpsEntityArgsGQL,
    object: () => UpsEntityObjectGQL,
    input: () => UpsEntityInputGQL,
  },
  class_validator: () => UpsEntityCV,
  mongodb: () => UpsEntityMongo,
};

export type UpsEntityType = UpsEntityCV;
