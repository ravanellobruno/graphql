const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList
} = require("graphql");
const TodoType = require("../todo/type");
const Todo = require("../../models/todo");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    password: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(user) {
        return Todo.find({ userId: user.id });
      },
    },
  }),
});

module.exports = UserType;
