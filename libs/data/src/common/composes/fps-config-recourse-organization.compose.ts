import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { AddressComposeRule, AddressComposeType } from './address.compose';

export const FPSConfigRecourseOrganizationComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class FPSConfigRecourseOrganization {
    @EntityValidator({
      context,
      required: true,
      entity: AddressComposeRule,
    })
    address!: AddressComposeType;

    @StringValidator({
      context,
      required: true,
    })
    name!: string;

    @StringValidator({
      context,
      required: true,
    })
    organizationId!: string;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'url',
      },
    })
    url!: string;
  }

  return FPSConfigRecourseOrganization;
};

@Context({ validator: 'graphql', type: 'object' })
export class FPSConfigRecourseOrganizationComposeObjectGQL extends FPSConfigRecourseOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class FPSConfigRecourseOrganizationComposeArgsGQL extends FPSConfigRecourseOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class FPSConfigRecourseOrganizationComposeInputGQL extends FPSConfigRecourseOrganizationComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class FPSConfigRecourseOrganizationComposeCV extends FPSConfigRecourseOrganizationComposeFactory(
  {
    validator: 'class_validator',
  },
) {}

@Context({ validator: 'mongodb' })
export class FPSConfigRecourseOrganizationComposeMongo extends FPSConfigRecourseOrganizationComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const FPSConfigRecourseOrganizationComposeRule: EntityValidatorType.EntityPanel =
  {
    graphql: {
      args: () => FPSConfigRecourseOrganizationComposeArgsGQL,
      object: () => FPSConfigRecourseOrganizationComposeObjectGQL,
      input: () => FPSConfigRecourseOrganizationComposeInputGQL,
    },
    class_validator: () => FPSConfigRecourseOrganizationComposeCV,
    mongodb: () => FPSConfigRecourseOrganizationComposeMongo,
  };

export type FPSConfigRecourseOrganizationComposeType =
  FPSConfigRecourseOrganizationComposeCV;
