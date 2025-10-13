const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require("graphql");

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

module.exports = TodoType;
