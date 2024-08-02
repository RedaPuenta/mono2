import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import {
  RecoursOrganizationComposeRule,
  RecoursOrganizationComposeType,
} from './recours-organization.compose';

export const LicensePlateComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class LicensePlate {
    @StringValidator({
      context,
      required: false,
    })
    plate?: string | null;

    @StringValidator({
      context,
      required: true,
    })
    plateCountry!: string;

    @EntityValidator({
      context,
      required: false,
      entity: RecoursOrganizationComposeRule,
    })
    pricingCategory?: RecoursOrganizationComposeType | null;
  }

  return LicensePlate;
};

@Context({ validator: 'graphql', type: 'object' })
export class LicensePlateComposeObjectGQL extends LicensePlateComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class LicensePlateComposeArgsGQL extends LicensePlateComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class LicensePlateComposeInputGQL extends LicensePlateComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class LicensePlateComposeCV extends LicensePlateComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class LicensePlateComposeMongo extends LicensePlateComposeFactory({
  validator: 'mongodb',
}) {}

export const LicensePlateComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => LicensePlateComposeArgsGQL,
    object: () => LicensePlateComposeObjectGQL,
    input: () => LicensePlateComposeInputGQL,
  },
  class_validator: () => LicensePlateComposeCV,
  mongodb: () => LicensePlateComposeMongo,
};

export type LicensePlateComposeType = LicensePlateComposeCV;
