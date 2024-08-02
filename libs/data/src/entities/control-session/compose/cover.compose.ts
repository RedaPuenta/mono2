import {
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { TarifTypeEnum } from '../enum/tarif-type.enum';

export const CoverComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Cover {
    @StringValidator({
      context,
      required: true,
      enumeration: TarifTypeEnum,
    })
    coverType!: TarifTypeEnum;

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
  }

  return Cover;
};

@Context({ validator: 'graphql', type: 'object' })
export class CoverComposeObjectGQL extends CoverComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class CoverComposeArgsGQL extends CoverComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class CoverComposeInputGQL extends CoverComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class CoverComposeCV extends CoverComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class CoverComposeMongo extends CoverComposeFactory({
  validator: 'mongodb',
}) {}

export const CoverComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => CoverComposeArgsGQL,
    object: () => CoverComposeObjectGQL,
    input: () => CoverComposeInputGQL,
  },
  class_validator: () => CoverComposeCV,
  mongodb: () => CoverComposeMongo,
};

export type CoverComposeType = CoverComposeCV;
