import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
  UnknownValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';

export const SiteEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Site extends BaseGeneric(context) {
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
      special: {
        type: 'mongoId',
      },
    })
    upsId!: string;

    @StringValidator({
      context,
      required: false,
      index: true,
      unique: true,
    })
    terminalId?: string | null;

    @StringValidator({
      context,
      required: true,
    })
    name!: string;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    address1?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    address2?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    zipcode?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    city?: string | null;

    @StringValidator({
      context,
      required: false,
      trim: true,
    })
    country?: string | null;

    @ArrayValidator({
      context,
      required: false,
      entity: () => Number as any,
    })
    coordinates?: Array<number> | null;

    @UnknownValidator({
      context,
      required: false,
    })
    config?: unknown | null;
  }

  return Site;
};

@Context({ validator: 'graphql', type: 'object' })
export class SiteEntityObjectGQL extends SiteEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class SiteEntityArgsGQL extends SiteEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class SiteEntityInputGQL extends SiteEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class SiteEntityCV extends SiteEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class SiteEntityMongo extends SiteEntityFactory({
  validator: 'mongodb',
}) {}

export const SiteEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => SiteEntityArgsGQL,
    object: () => SiteEntityObjectGQL,
    input: () => SiteEntityInputGQL,
  },
  class_validator: () => SiteEntityCV,
  mongodb: () => SiteEntityMongo,
};

export type SiteEntityType = SiteEntityCV;
