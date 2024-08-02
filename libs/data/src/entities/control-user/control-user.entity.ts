import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';

export const ControlUserEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlUser extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    accountId!: string;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'email',
      },
      unique: true,
      trim: true,
      formalize: 'lowercase',
    })
    username!: string;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    firstName?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    lastName?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
      minLength: 3,
      maxLength: 3,
    })
    fpsAgentId?: string | null;

    @NumberValidator({
      context,
      required: false,
      max: 999,
      byDefault: 1,
    })
    fpsOrderCount?: number | null;

    @NumberValidator({
      context,
      required: false,
      min: 1,
      max: 9,
      byDefault: 1,
    })
    authorityId?: number | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    fpsAgentName?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
      special: {
        type: 'phone',
      },
    })
    phone?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    lang?: string | null;

    @ArrayValidator({
      context,
      required: false,
      entity: () => String as any,
    })
    ups?: Array<string> | null;
  }

  return ControlUser;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlUserEntityObjectGQL extends ControlUserEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlUserEntityArgsGQL extends ControlUserEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlUserEntityInputGQL extends ControlUserEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ControlUserEntityCV extends ControlUserEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ControlUserEntityMongo extends ControlUserEntityFactory({
  validator: 'mongodb',
}) {}

export const ControlUserEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlUserEntityArgsGQL,
    object: () => ControlUserEntityObjectGQL,
    input: () => ControlUserEntityInputGQL,
  },
  class_validator: () => ControlUserEntityCV,
  mongodb: () => ControlUserEntityMongo,
};

export type ControlUserEntityType = ControlUserEntityCV;
