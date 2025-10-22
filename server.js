const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const { verifyToken } = require("./utils/token");
const expressPlayground = require("graphql-playground-middleware-express").default;

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    let user = null;

    if (token) {
      try {
        user = verifyToken(token);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    return {
      schema,
      graphiql: false,
      context: { user },
    };
  })
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(process.env.PORT, () => {
  // console.log(`Server running at http://localhost:${process.env.PORT}/graphql`);
  console.log(`GraphQL Playground at http://localhost:${process.env.PORT}/playground`);
});
