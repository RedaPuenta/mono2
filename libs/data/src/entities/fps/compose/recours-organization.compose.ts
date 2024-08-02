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

export const RecoursOrganizationComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class RecoursOrganization {
    @StringValidator({
      context,
      required: true,
    })
    organizationId!: string;

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

  return RecoursOrganization;
};

@Context({ validator: 'graphql', type: 'object' })
export class RecoursOrganizationComposeObjectGQL extends RecoursOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class RecoursOrganizationComposeArgsGQL extends RecoursOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class RecoursOrganizationComposeInputGQL extends RecoursOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class RecoursOrganizationComposeCV extends RecoursOrganizationComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class RecoursOrganizationComposeMongo extends RecoursOrganizationComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const RecoursOrganizationComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => RecoursOrganizationComposeArgsGQL,
    object: () => RecoursOrganizationComposeObjectGQL,
    input: () => RecoursOrganizationComposeInputGQL,
  },
  class_validator: () => RecoursOrganizationComposeCV,
  mongodb: () => RecoursOrganizationComposeMongo,
};

export type RecoursOrganizationComposeType = RecoursOrganizationComposeCV;
