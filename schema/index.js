const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const userQueries = require("./user/queries");
const userMutations = require("./user/mutations");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...userQueries,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...userMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
