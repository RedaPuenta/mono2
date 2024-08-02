import {
  ArrayValidator,
  BooleanValidator,
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';
import {
  AccountCredentialComposeRule,
  AccountCredentialComposeType,
} from './compose/account-credential.compose';
import { AccountStateEnum } from './enum/account-state.enum';

export const AccountEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Account extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
      index: true,
    })
    consumer!: string;

    @StringValidator({
      context,
      required: true,
      index: true,
    })
    type!: string;

    @StringValidator({
      context,
      required: true,
    })
    lang!: string;

    @ArrayValidator({
      context,
      required: true,
      entity: AccountCredentialComposeRule,
    })
    credentials!: Array<AccountCredentialComposeType>;

    @StringValidator({
      context,
      required: false,
      special: {
        type: 'password',
      },
    })
    password?: string | null;

    @StringValidator({
      context,
      required: true,
      enumeration: AccountStateEnum,
      byDefault: 'UNVERIFIED',
    })
    state!: AccountStateEnum;

    @ArrayValidator({
      context,
      required: true,
      entity: AccountCredentialComposeRule,
      byDefault: [],
    })
    validationSteps!: Array<AccountCredentialComposeType>;

    @BooleanValidator({
      context,
      required: true,
      byDefault: false,
    })
    tfaActivated!: boolean;

    @StringValidator({
      context,
      required: false,
    })
    otpToken?: string | null;

    @DateValidator({
      context,
      required: false,
    })
    verifiedAt?: string | null;
  }

  return Account;
};

@Context({ validator: 'graphql', type: 'object' })
export class AccountEntityObjectGQL extends AccountEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class AccountEntityArgsGQL extends AccountEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class AccountEntityInputGQL extends AccountEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class AccountEntityCV extends AccountEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class AccountEntityMongo extends AccountEntityFactory({
  validator: 'mongodb',
}) {}

export const AccountEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => AccountEntityArgsGQL,
    object: () => AccountEntityObjectGQL,
    input: () => AccountEntityInputGQL,
  },
  class_validator: () => AccountEntityCV,
  mongodb: () => AccountEntityMongo,
};

export type AccountEntityType = AccountEntityCV;
