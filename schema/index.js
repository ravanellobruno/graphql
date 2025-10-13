const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const userQueries = require("./user/queries");
const userMutations = require("./user/mutations");
const todoQueries = require("./todo/queries");
const todoMutations = require("./todo/mutations");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...userQueries,
    ...todoQueries,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...userMutations,
    ...todoMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
