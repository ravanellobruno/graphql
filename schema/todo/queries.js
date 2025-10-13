const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const TodoType = require("./type");
const Todo = require("../../models/todo");
const requireAuth = require("../../utils/auth");

module.exports = {
  todos: {
    type: new GraphQLList(TodoType),
    resolve: requireAuth(() => {
      return Todo.find();
    }),
  },
  todosByUser: {
    type: new GraphQLList(TodoType),
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: requireAuth((_, args) => {
      return Todo.find({ userId: args.userId });
    }),
  },
  todoById: {
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: requireAuth((_, args) => {
      return Todo.findById(args.id);
    }),
  },
};
