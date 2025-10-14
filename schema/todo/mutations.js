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
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
    },
    resolve: requireAuth(async (_, args, { user }) => {
      const todo = new Todo({
        userId: user.id,
        title: args.title,
        description: args.description,
      });

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
    resolve: requireAuth(async (_, args, { user }) => {
      const todo = await Todo.findById(args.id);
      
      if (!todo) throw new Error("Todo not found");

      if (todo.userId.toString() !== user.id) {
        throw new Error("Not authorized to update this todo");
      }

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
    resolve: requireAuth(async (_, args, { user }) => {
      const todo = await Todo.findById(args.id);
      
      if (!todo) throw new Error("Todo not found");

      if (todo.userId.toString() !== user.id) {
        throw new Error("Not authorized to delete this todo");
      }

      return Todo.findByIdAndDelete(args.id);
    }),
  },
};
