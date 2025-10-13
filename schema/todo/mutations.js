const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const TodoType = require("./type");
const Todo = require("../../models/todo");

module.exports = {
  createTodo: {
    type: TodoType,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
    },
    resolve(_, args, context) {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const todo = new Todo(args);
      return todo.save();
    },
  },
  updateTodo: {
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    resolve(_, args) {
      return Todo.findByIdAndUpdate(
        args.id,
        { $set: args },
        { new: true }
      );
    },
  },
  deleteTodo: {
    type: TodoType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(_, args) {
      return Todo.findByIdAndDelete(args.id);
    },
  },
};
