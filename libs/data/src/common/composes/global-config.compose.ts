import {
  Context,
  ContextValidatorType,
  EntityValidator,
  EntityValidatorType,
} from '@lib/decorators';
import {
  FPSConfigComposeRule,
  FPSConfigComposeType,
} from './fps-config.compose';
import {
  OnstreetConfigComposeRule,
  OnstreetConfigComposeType,
} from './onstreet-config.compose';
import {
  P1000ConfigComposeRule,
  P1000ConfigComposeType,
} from './p1000-config.compose';
import {
  PrestoOneConfigComposeRule,
  PrestoOneConfigComposeType,
} from './presto-one-config.compose';
import {
  PrestoParkConfigComposeRule,
  PrestoParkConfigComposeType,
} from './presto-park-config.compose';
import {
  PrestoScanConfigComposeRule,
  PrestoScanConfigComposeType,
} from './presto-scan-config.compose';
import {
  TicketHubConfigComposeConfigRule,
  TicketHubConfigComposeConfigType,
} from './tickets-hub-config.compose';

export const GlobalConfigComposeFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class GlobalConfig {
    @EntityValidator({
      context,
      required: false,
      entity: TicketHubConfigComposeConfigRule,
    })
    ticketsHub?: TicketHubConfigComposeConfigType | null;

    @EntityValidator({
      context,
      required: false,
      entity: PrestoOneConfigComposeRule,
    })
    prestoOne?: PrestoOneConfigComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: PrestoScanConfigComposeRule,
    })
    prestoscan?: PrestoScanConfigComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: OnstreetConfigComposeRule,
    })
    onstreet?: OnstreetConfigComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: FPSConfigComposeRule,
    })
    fps?: FPSConfigComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: PrestoParkConfigComposeRule,
    })
    prestoPark?: PrestoParkConfigComposeType | null;

    @EntityValidator({
      context,
      required: false,
      entity: P1000ConfigComposeRule,
    })
    p1000?: P1000ConfigComposeType | null;
  }

  return GlobalConfig;
};

@Context({ validator: 'graphql', type: 'object' })
export class GlobalConfigComposeObjectGQL extends GlobalConfigComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class GlobalConfigComposeArgsGQL extends GlobalConfigComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class GlobalConfigComposeInputGQL extends GlobalConfigComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class GlobalConfigComposeCV extends GlobalConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class GlobalConfigComposeMongo extends GlobalConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const GlobalConfigComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => GlobalConfigComposeArgsGQL,
    object: () => GlobalConfigComposeObjectGQL,
    input: () => GlobalConfigComposeInputGQL,
  },
  class_validator: () => GlobalConfigComposeCV,
  mongodb: () => GlobalConfigComposeMongo,
};

export type GlobalConfigComposeType = GlobalConfigComposeCV;
