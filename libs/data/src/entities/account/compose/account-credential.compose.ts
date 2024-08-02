import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const AccountCredentialComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class AccountCredential {
    @StringValidator({
      context,
      required: true,
    })
    type!: string;

    @StringValidator({
      context,
      required: true,
    })
    value!: string;
  }

  return AccountCredential;
};

@Context({ validator: 'graphql', type: 'object' })
export class AccountCredentialComposeObjectGQL extends AccountCredentialComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class AccountCredentialComposeArgsGQL extends AccountCredentialComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class AccountCredentialComposeInputGQL extends AccountCredentialComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class AccountCredentialComposeCV extends AccountCredentialComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class AccountCredentialComposeMongo extends AccountCredentialComposeFactory({
  validator: 'mongodb',
}) {}

export const AccountCredentialComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => AccountCredentialComposeArgsGQL,
    object: () => AccountCredentialComposeObjectGQL,
    input: () => AccountCredentialComposeInputGQL,
  },
  class_validator: () => AccountCredentialComposeCV,
  mongodb: () => AccountCredentialComposeMongo,
};

export type AccountCredentialComposeType = AccountCredentialComposeCV;
