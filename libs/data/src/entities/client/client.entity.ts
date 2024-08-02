import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  StringValidator,
  UnknownValidator,
} from '@lib/decorators';
import {
  GlobalConfigComposeRule,
  GlobalConfigComposeType,
} from '../../common/composes/global-config.compose';
import {
  TranslationComposeRule,
  TranslationComposeType,
} from '../../common/composes/translation.compose';
import { BaseGeneric } from '../../generics/base.generic';

export const ClientEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Client extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      unique: true,
      trim: true,
    })
    slug!: string;

    @StringValidator({
      context,
      required: true,
      unique: true,
    })
    code!: string;

    @StringValidator({
      context,
      required: true,
    })
    name!: string;

    @StringValidator({
      context,
      required: false,
    })
    siret?: string | null;

    @StringValidator({
      context,
      required: true,
      byDefault: 'CHF',
      minLength: 2,
      maxLength: 3,
    })
    defaultCurrency!: string;

    @StringValidator({
      context,
      required: true,
    })
    defaultContractTag!: string;

    @StringValidator({
      context,
      required: true,
    })
    timezone!: string;

    @StringValidator({
      context,
      required: true,
    })
    locale!: string;

    @UnknownValidator({
      context,
      required: true,
    })
    services!: unknown;

    @EntityValidator({
      context,
      required: false,
      entity: GlobalConfigComposeRule,
    })
    config?: GlobalConfigComposeType | null;

    @ArrayValidator({
      context,
      required: false,
      entity: TranslationComposeRule,
    })
    translation?: Array<TranslationComposeType> | null;
  }

  return Client;
};

@Context({ validator: 'graphql', type: 'object' })
export class ClientEntityObjectGQL extends ClientEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ClientEntityArgsGQL extends ClientEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ClientEntityInputGQL extends ClientEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ClientEntityCV extends ClientEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ClientEntityMongo extends ClientEntityFactory({
  validator: 'mongodb',
}) {}

export const ClientEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ClientEntityArgsGQL,
    object: () => ClientEntityObjectGQL,
    input: () => ClientEntityInputGQL,
  },
  class_validator: () => ClientEntityCV,
  mongodb: () => ClientEntityMongo,
};

export type ClientEntityType = ClientEntityCV;
