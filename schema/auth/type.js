const { GraphQLObjectType, GraphQLString } = require("graphql");
const UserType = require("../user/type");

const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType },
  }),
});

module.exports = AuthType;
