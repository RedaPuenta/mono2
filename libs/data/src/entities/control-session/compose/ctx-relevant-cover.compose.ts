import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { TarifTypeEnum } from '../enum/tarif-type.enum';

export const CTXRelevantCoverComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class CTXRelevantCover {
    @DateValidator({
      context,
      required: true,
    })
    startDate!: string;

    @DateValidator({
      context,
      required: true,
    })
    endDate!: string;

    @StringValidator({
      context,
      required: true,
      enumeration: TarifTypeEnum,
    })
    tariffType!: TarifTypeEnum;

    @StringValidator({
      context,
      required: true,
    })
    usedMeansOfPayment!: string;

    @ArrayValidator({
      context,
      required: true,
      entity: () => String as any,
    })
    legacyId!: Array<string>;

    @StringValidator({
      context,
      required: true,
      special: {
        type: 'mongoId',
      },
    })
    upsId!: string;

    @StringValidator({
      context,
      required: false,
    })
    status?: string | null;
  }

  return CTXRelevantCover;
};

@Context({ validator: 'graphql', type: 'object' })
export class CTXRelevantCoverComposeObjectGQL extends CTXRelevantCoverComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class CTXRelevantCoverComposeArgsGQL extends CTXRelevantCoverComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class CTXRelevantCoverComposeInputGQL extends CTXRelevantCoverComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class CTXRelevantComposeCoverCV extends CTXRelevantCoverComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class CTXRelevantComposeCoverMongo extends CTXRelevantCoverComposeFactory(
  {
    validator: 'mongodb',
  },
) {}

export const CTXRelevantCoverComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => CTXRelevantCoverComposeArgsGQL,
    object: () => CTXRelevantCoverComposeObjectGQL,
    input: () => CTXRelevantCoverComposeInputGQL,
  },
  class_validator: () => CTXRelevantComposeCoverCV,
  mongodb: () => CTXRelevantComposeCoverMongo,
};

export type CTXRelevantCoverComposeType = CTXRelevantComposeCoverCV;
