import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { TicketHubSystemEnum } from '../enum/tickets-hub-system.enum';

export const TicketHubConfigComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class TicketHub {
    @StringValidator({
      context,
      required: true,
      enumeration: TicketHubSystemEnum,
    })
    system!: TicketHubSystemEnum;
  }

  return TicketHub;
};

@Context({ validator: 'graphql', type: 'object' })
export class TicketHubConfigComposeObjectGQL extends TicketHubConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'object',
  },
) {}

@Context({ validator: 'graphql', type: 'args' })
export class TicketHubConfigComposeArgsGQL extends TicketHubConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'args',
  },
) {}

@Context({ validator: 'graphql', type: 'input' })
export class TicketHubConfigComposeInputGQL extends TicketHubConfigComposeFactory(
  {
    validator: 'graphql',
    type: 'input',
  },
) {}

@Context({ validator: 'class_validator' })
export class TicketHubConfigComposeCV extends TicketHubConfigComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class TicketHubConfigComposeMongo extends TicketHubConfigComposeFactory({
  validator: 'mongodb',
}) {}

export const TicketHubConfigComposeConfigRule: EntityValidatorType.EntityPanel =
  {
    graphql: {
      args: () => TicketHubConfigComposeArgsGQL,
      object: () => TicketHubConfigComposeObjectGQL,
      input: () => TicketHubConfigComposeInputGQL,
    },
    class_validator: () => TicketHubConfigComposeCV,
    mongodb: () => TicketHubConfigComposeMongo,
  };

export type TicketHubConfigComposeConfigType = TicketHubConfigComposeCV;
