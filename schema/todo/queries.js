const {
  GraphQLList,
} = require("graphql");

const TodoType = require("./type");
const Todo = require("../../models/todo");
const requireAuth = require("../../utils/auth");

module.exports = {
  todosByUser: {
    type: new GraphQLList(TodoType),
    resolve: requireAuth((_, args, { user }) => {
      const userId = user.id;
      return Todo.find({ userId });
    }),
  },
};
