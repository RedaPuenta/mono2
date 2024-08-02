import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
  NumberValidator,
  StringValidator,
} from '@lib/decorators';
import { NotificationAuthorityEnum } from '../enum/notification-authority.enum';
import {
  FPSConfigRecourseOrganizationComposeRule,
  FPSConfigRecourseOrganizationComposeType,
} from './fps-config-recourse-organization.compose';

export const FPSConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class FPSConfig {
    @NumberValidator({
      context,
      required: true,
    })
    maximumDuration!: number;

    @NumberValidator({
      context,
      required: true,
    })
    maximumAmount!: number;

    @StringValidator({
      context,
      required: true,
    })
    system!: string;

    @StringValidator({
      context,
      required: true,
      enumeration: NotificationAuthorityEnum,
    })
    notificationAuthority!: NotificationAuthorityEnum;

    @NumberValidator({
      context,
      required: true,
    })
    finePrice!: number;

    @NumberValidator({
      context,
      required: true,
    })
    reducedFinePrice!: number;

    @EntityValidator({
      context,
      required: true,
      entity: FPSConfigRecourseOrganizationComposeRule,
    })
    address!: FPSConfigRecourseOrganizationComposeType;
  }

  return FPSConfig;
};

@Context({ validator: 'graphql', type: 'object' })
export class FPSConfigComposeObjectGQL extends FPSConfigComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class FPSConfigComposeArgsGQL extends FPSConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class FPSConfigComposeInputGQL extends FPSConfigComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class FPSConfigComposeCV extends FPSConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class FPSConfigComposeMongo extends FPSConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const FPSConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => FPSConfigComposeArgsGQL,
    object: () => FPSConfigComposeObjectGQL,
    input: () => FPSConfigComposeInputGQL,
  },
  class_validator: () => FPSConfigComposeCV,
  mongodb: () => FPSConfigComposeMongo,
};

export type FPSConfigComposeType = FPSConfigComposeCV;
