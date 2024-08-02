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

export const ClaimNewOffenderComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ClaimNewOffender {
    @StringValidator({
      context,
      required: false,
    })
    gender?: string | null;

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

    @EntityValidator({
      context,
      required: false,
      entity: AddressComposeRule,
    })
    address?: AddressComposeType | null;
  }

  return ClaimNewOffender;
};

@Context({ validator: 'graphql', type: 'object' })
export class ClaimNewOffenderComposeObjectGQL extends ClaimNewOffenderComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ClaimNewOffenderComposeArgsGQL extends ClaimNewOffenderComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ClaimNewOffenderComposeInputGQL extends ClaimNewOffenderComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ClaimNewOffenderComposeCV extends ClaimNewOffenderComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ClaimNewOffenderComposeMongo extends ClaimNewOffenderComposeFactory({
  validator: 'mongodb',
}) {}

export const ClaimNewOffenderComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ClaimNewOffenderComposeArgsGQL,
    object: () => ClaimNewOffenderComposeObjectGQL,
    input: () => ClaimNewOffenderComposeInputGQL,
  },
  class_validator: () => ClaimNewOffenderComposeCV,
  mongodb: () => ClaimNewOffenderComposeMongo,
};

export type ClaimNewOffenderComposeType = ClaimNewOffenderComposeCV;
