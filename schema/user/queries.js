const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const UserType = require("./type");
const User = require("../../models/user");

module.exports = {
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return User.findById(args.id);
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
