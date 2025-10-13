const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const TodoType = require("./type");
const Todo = require("../../models/todo");
const requireAuth = require("../../utils/auth");

module.exports = {
  createTodo: {
    type: TodoType,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
    },
    resolve: requireAuth((_, args) => {
      const todo = new Todo(args);
      return todo.save();
    }),
  },
  updateTodo: {
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve: requireAuth((_, args) => {
      return Todo.findByIdAndUpdate(
        args.id,
        { $set: args },
        { new: true }
      );
    }),
  },
  deleteTodo: {
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: requireAuth((_, args) => {
      return Todo.findByIdAndDelete(args.id);
    }),
  },
};
