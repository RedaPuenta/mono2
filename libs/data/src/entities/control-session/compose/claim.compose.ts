import {
  Context,
  ContextValidatorType,
  DateValidator,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import { ClaimReasonEnum } from '../enum/claim-reason.enum';
import { ClaimStatusEnum } from '../enum/claim-status.enum';
import { ClaimTypeEnum } from '../enum/claim-type.enum';
import {
  ClaimNewOffenderComposeRule,
  ClaimNewOffenderComposeType,
} from './claim-new-offender.compose';

export const ClaimComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Claim {
    @StringValidator({
      context,
      required: true,
      enumeration: ClaimTypeEnum,
    })
    claimType!: ClaimTypeEnum;

    @StringValidator({
      context,
      required: true,
      enumeration: ClaimStatusEnum,
    })
    claimStatus!: ClaimStatusEnum;

    @NumberValidator({
      context,
      required: true,
    })
    claimOrigin!: 0 /* PrestoPark */ | 1 /* Presto 1000 */ | 99 /* All */;

    @StringValidator({
      context,
      required: true,
      enumeration: ClaimReasonEnum,
    })
    claimReason!: ClaimReasonEnum;

    @StringValidator({
      context,
      required: false,
    })
    claimMessage?: string | null;

    @StringValidator({
      context,
      required: false,
    })
    claimResponse?: string | null;

    @DateValidator({
      context,
      required: true,
    })
    dateCreated!: string;

    @EntityValidator({
      context,
      required: true,
      entity: ClaimNewOffenderComposeRule,
    })
    newOffender!: ClaimNewOffenderComposeType;

    @StringValidator({
      context,
      required: true,
    })
    acknowledgementDatetime!: string;
  }

  return Claim;
};

@Context({ validator: 'graphql', type: 'object' })
export class ClaimComposeObjectGQL extends ClaimComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ClaimComposeArgsGQL extends ClaimComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ClaimComposeInputGQL extends ClaimComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ClaimComposeCV extends ClaimComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ClaimComposeMongo extends ClaimComposeFactory({
  validator: 'mongodb',
}) {}

export const ClaimComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ClaimComposeArgsGQL,
    object: () => ClaimComposeObjectGQL,
    input: () => ClaimComposeInputGQL,
  },
  class_validator: () => ClaimComposeCV,
  mongodb: () => ClaimComposeMongo,
};

export type ClaimComposeType = ClaimComposeCV;
