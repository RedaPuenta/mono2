import {
  Context,
  ContextValidatorType,
  EntityValidatorType,
  StringValidator,
} from '@lib/decorators';
import { BaseGeneric } from '../../generics/base.generic';

export const TerminalEntityFactory = (context: ContextValidatorType.Props) => {
  @Context(context)
  class Terminal extends BaseGeneric(context) {
    @StringValidator({
      context,
      required: true,
    })
    terminalId!: string;
  }

  return Terminal;
};

@Context({ validator: 'graphql', type: 'object' })
export class TerminalEntityObjectGQL extends TerminalEntityFactory({
  validator: 'graphql',
  type: 'object',
}) {}

@Context({ validator: 'graphql', type: 'args' })
export class TerminalEntityArgsGQL extends TerminalEntityFactory({
  validator: 'graphql',
  type: 'args',
}) {}

@Context({ validator: 'graphql', type: 'input' })
export class TerminalEntityInputGQL extends TerminalEntityFactory({
  validator: 'graphql',
  type: 'input',
}) {}

@Context({ validator: 'class_validator' })
export class TerminalEntityCV extends TerminalEntityFactory({
  validator: 'class_validator',
}) {}

@Context({ validator: 'mongodb' })
export class TerminalEntityMongo extends TerminalEntityFactory({
  validator: 'mongodb',
}) {}

export const TerminalEntityRule: EntityValidatorType.EntityPanel = {
  graphql: {
    args: () => TerminalEntityArgsGQL,
    object: () => TerminalEntityObjectGQL,
    input: () => TerminalEntityInputGQL,
  },
  class_validator: () => TerminalEntityCV,
  mongodb: () => TerminalEntityMongo,
};

export type TerminalEntityType = TerminalEntityCV;
