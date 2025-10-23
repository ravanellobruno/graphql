const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const UserType = require("./type");
const User = require("../../models/user");
const { getCachedUser } = require("../../utils/redis_user");

module.exports = {
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    async resolve(_, args) {
      return await getCachedUser(args.id);
    },
  },
  users: {
    type: new GraphQLList(UserType),
    resolve() {
      return User.find();
    },
  },
  usersByEmailLike: {
    type: new GraphQLList(UserType),
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_, args) {
      return User.find({
        email: { $regex: args.email, $options: "i" },
      });
    },
  },
};
