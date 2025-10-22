const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const connectDB = require("./config/db");
const authenticate = require("./middleware/auth");
const expressPlayground = require("graphql-playground-middleware-express").default;

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use("/graphql", graphqlHTTP((req) => {
  const user = authenticate(req);

  return {
    schema,
    graphiql: false,
    context: { user },
  };
}));

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(PORT, () => {
  console.log(`playground: http://localhost:${PORT}/playground`);
});
