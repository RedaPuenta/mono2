import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import {
  AddressComposeRule,
  AddressComposeType,
} from '../../../common/composes/address.compose';

export const UserDetailsComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class FPSUserDetails {
    @StringValidator({
      context,
      required: false,
    })
    gender?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    honorificPrefix?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    givenName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    additionalName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    maidenName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    familyName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    organizationId?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    name?: string | null;

    @StringValidator({
      context,
      required: false,
      special: {
        type: 'url',
      },
    })
    url?: string | null;

    @EntityValidator({
      context,
      required: false,
      entity: AddressComposeRule,
    })
    address?: AddressComposeType | null;
  }

  return FPSUserDetails;
};

@Context({ validator: 'graphql', type: 'object' })
export class FPSUserDetailsComposeObjectGQL extends UserDetailsComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class FPSUserDetailsComposeArgsGQL extends UserDetailsComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class FPSUserDetailsComposeInputGQL extends UserDetailsComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class FPSUserDetailsComposeCV extends UserDetailsComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class FPSUserDetailsComposeMongo extends UserDetailsComposeFactory({
  validator: 'mongodb',
}) {}

export const UserDetailsComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => FPSUserDetailsComposeArgsGQL,
    object: () => FPSUserDetailsComposeObjectGQL,
    input: () => FPSUserDetailsComposeInputGQL,
  },
  class_validator: () => FPSUserDetailsComposeCV,
  mongodb: () => FPSUserDetailsComposeMongo,
};

export type UserDetailsComposeType = FPSUserDetailsComposeCV;
