import {
  GraphQLScalarType,
  Kind,
  ListValueNode,
  ObjectValueNode,
  ValueNode,
} from 'graphql';

const parseLiteral = (ast: ValueNode): any => {
  switch (ast.kind) {
    case Kind.BOOLEAN:
    case Kind.STRING:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.LIST:
      return (ast as ListValueNode).values.map(parseLiteral);
    case Kind.OBJECT:
      return (ast as ObjectValueNode).fields.reduce((accumulator, field) => {
        accumulator[field.name.value] = parseLiteral(field.value);
        return accumulator;
      }, {} as Record<string, any>);
    case Kind.NULL:
      return null;
    default:
      throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`);
  }
};

export const UnknownScalar = new GraphQLScalarType({
  name: 'Unknown',
  description: 'Unknown value',
  parseValue: (value) => value,
  parseLiteral,
  serialize: (value) => value,
});
