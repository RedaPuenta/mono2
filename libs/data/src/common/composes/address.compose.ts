import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';

export const AddressComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Address {
    @StringValidator({
      context,
      required: false,
    })
    streetNumber?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    streetNumberBis?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    streetType?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    streetName?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    specialPlace?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    postOfficeBoxNumber?: string | null;

    @StringValidator({
      context,
      required: false,
      special: {
        type: 'postalCode',
      },
    })
    postalCode?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    addressSubRegion?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    addressRegion?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    addressLocality?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    addressCountry?: string | null;
  }

  return Address;
};

@Context({ validator: 'graphql', type: 'object' })
export class AddressComposeObjectGQL extends AddressComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class AddressComposeArgsGQL extends AddressComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class AddressComposeInputGQL extends AddressComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class AddressComposeCV extends AddressComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class AddressComposeMongo extends AddressComposeFactory({
  validator: 'mongodb',
}) {}

export const AddressComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => AddressComposeArgsGQL,
    object: () => AddressComposeObjectGQL,
    input: () => AddressComposeInputGQL,
  },
  class_validator: () => AddressComposeCV,
  mongodb: () => AddressComposeMongo,
};

export type AddressComposeType = AddressComposeCV;
