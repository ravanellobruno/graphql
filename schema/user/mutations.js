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
const { generateToken } = require("../../token.js");

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

      return user.save();
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
      if (args.password) {
        args.password = await bcrypt.hash(args.password, SALT_ROUNDS);
      }

      return User.findByIdAndUpdate(args.id, { $set: args }, { new: true });
    },
  },
  deleteUser: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(_, args) {
      return User.findByIdAndDelete(args.id);
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
      
      return { token, user };
    },
  }
};
