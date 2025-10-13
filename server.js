const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const { verifyToken } = require("./token");
const expressPlayground = require("graphql-playground-middleware-express").default;

const app = express();
const port = 4000;
const mongoPort = 27017;

mongoose.connect(`mongodb://localhost:${mongoPort}/graphql`, {
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

app.listen(port, () => {
  // console.log(`Server running at http://localhost:${port}/graphql`);
  console.log(`GraphQL Playground at http://localhost:${port}/playground`);
});
