import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';

export const PmsTechnicalUserEntityFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class PmsTechnicalUser extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      index: true,
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
  }

  return PmsTechnicalUser;
};

@Context({ validator: 'graphql', type: 'object' })
export class PmsTechnicalUserEntityObjectGQL extends PmsTechnicalUserEntityFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class PmsTechnicalUserEntityArgsGQL extends PmsTechnicalUserEntityFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class PmsTechnicalUserEntityInputGQL extends PmsTechnicalUserEntityFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class PmsTechnicalUserEntityCV extends PmsTechnicalUserEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class PmsTechnicalUserEntityMongo extends PmsTechnicalUserEntityFactory({
  validator: 'mongodb',
}) {}

export const PmsTechnicalUserEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => PmsTechnicalUserEntityArgsGQL,
    object: () => PmsTechnicalUserEntityObjectGQL,
    input: () => PmsTechnicalUserEntityInputGQL,
  },
  class_validator: () => PmsTechnicalUserEntityCV,
  mongodb: () => PmsTechnicalUserEntityMongo,
};

export type PmsTechnicalUserEntityType = PmsTechnicalUserEntityCV;
