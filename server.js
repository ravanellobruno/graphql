const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const { verifyToken } = require("./token");

const app = express();
const port = 4000;
const mongoPort = 27017;

mongoose.connect(`mongodb://localhost:${mongoPort}/graphql`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () =>
  console.log("Connected to MongoDB")
);

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
      graphiql: true,
      context: { user },
    };
  })
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
});
