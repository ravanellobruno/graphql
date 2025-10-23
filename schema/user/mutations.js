const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const UserType = require("./type");
const User = require("../../models/user");
const AuthType = require("../auth/type.js");
const { generateToken } = require("../../utils/token.js");
const { cacheUser, deleteCachedUser } = require("../../utils/redis_user");

module.exports = {
  createUser: {
    type: UserType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLInt },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, args) {
      const hash = await bcrypt.hash(args.password, SALT_ROUNDS);

      const user = new User({
        name: args.name,
        email: args.email,
        age: args.age,
        password: hash,
      });

      const savedUser = await user.save();
      await cacheUser(savedUser);

      return savedUser;
    },
  },
  updateUser: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      age: { type: GraphQLInt },
      password: { type: GraphQLString },
    },
    async resolve(_, args) {
      const user = await User.findById(args.id);

      if (!user) throw new Error("User not found");

      if (args.password) {
        args.password = await bcrypt.hash(args.password, SALT_ROUNDS);
      }

      const updatedUser = await User.findByIdAndUpdate(
        args.id,
        { $set: args },
        { new: true }
      );

      await cacheUser(updatedUser);
      
      return updatedUser;
    },
  },
  deleteUser: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    async resolve(_, args) {
      const user = await User.findById(args.id);

      if (!user) throw new Error("User not found");

      const deletedUser = await User.findByIdAndDelete(args.id);
      await deleteCachedUser(args.id);

      return deletedUser;
    },
  },
  login: {
    type: AuthType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, args) {
      const user = await User.findOne({ email: args.email });

      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(args.password, user.password);

      if (!isValid) throw new Error("Invalid password");

      const token = generateToken(user);
      await cacheUser(user);

      return { token, user };
    },
  },
};
