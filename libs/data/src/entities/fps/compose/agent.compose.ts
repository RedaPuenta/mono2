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

export const ControlAgentComposeFactory = (
  context: ContextValidatorType.Props,
) => {
  @Context(context)
  class ControlAgent {
    @StringValidator({
      context,
      required: false,
    })
    name?: string | null;

    @StringValidator({
      context,
      required: true,
    })
    agentId!: string;

    @EntityValidator({
      context,
      required: false,
      entity: RecoursOrganizationComposeRule,
    })
    worksFor?: RecoursOrganizationComposeType | null;
  }

  return ControlAgent;
};

@Context({ validator: 'graphql', type: 'object' })
export class ControlAgentComposeObjectGQL extends ControlAgentComposeFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class ControlAgentComposeArgsGQL extends ControlAgentComposeFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class ControlAgentComposeInputGQL extends ControlAgentComposeFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class ControlAgentComposeCV extends ControlAgentComposeFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class ControlAgentComposeMongo extends ControlAgentComposeFactory({
  validator: 'mongodb',
}) {}

export const ControlAgentComposeRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => ControlAgentComposeArgsGQL,
    object: () => ControlAgentComposeObjectGQL,
    input: () => ControlAgentComposeInputGQL,
  },
  class_validator: () => ControlAgentComposeCV,
  mongodb: () => ControlAgentComposeMongo,
};

export type ControlAgentComposeType = ControlAgentComposeCV;
