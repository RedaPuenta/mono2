import {
  ArrayValidator,
  Context,
  ContextValidatorType,
  EntityValidatorType,
} from '@lib/decorators';
import { ClaimComposeRule, ClaimComposeType } from './claim.compose';
import {
  CTXRelevantCoverComposeRule,
  CTXRelevantCoverComposeType,
} from './ctx-relevant-cover.compose';

export const ControlContextComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class ControlContext {
    @ArrayValidator({
      context,
      required: false,
      entity: CTXRelevantCoverComposeRule,
    })
    ctxRelevantCovers?: Array<CTXRelevantCoverComposeType> | null;

    @ArrayValidator({
      context,
      required: false,
      entity: ClaimComposeRule,
    })
    claims?: Array<ClaimComposeType> | null;
  }

  return ControlContext;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlContextComposeObjectGQL extends ControlContextComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlContextComposeArgsGQL extends ControlContextComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlContextComposeInputGQL extends ControlContextComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ControlContextComposeCV extends ControlContextComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ControlContextComposeMongo extends ControlContextComposeFactory({
  validator: 'mongodb',
}) {}

export const ControlContextComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlContextComposeArgsGQL,
    object: () => ControlContextComposeObjectGQL,
    input: () => ControlContextComposeInputGQL,
  },
  class_validator: () => ControlContextComposeCV,
  mongodb: () => ControlContextComposeMongo,
};

export type ControlContextComposeType = ControlContextComposeCV;
