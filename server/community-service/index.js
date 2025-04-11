const { ApolloServer } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const express = require("express");
const {
  typeDefsHelpRequestPost,
} = require("./graphql/neighbourhoodHelpRequests/schemas/HelpRequestPost.typeDefs.server.js");
const {
  resolversHelpRequestPost,
} = require("./graphql/neighbourhoodHelpRequests/resolvers/HelpRequestPost.resolver.server.js");
const { typeDefs } = require("./graphql/typeDefs.js");
const { resolvers } = require("./graphql/resolvers.js");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = 4004;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://studio.apollographql.com"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

const mergedTypeDefs = mergeTypeDefs([typeDefs, typeDefsHelpRequestPost]); //https://the-guild.dev/graphql/tools/docs/schema-merging#merging-type-definitions
const mergedResolvers = mergeResolvers([resolvers, resolversHelpRequestPost]); //https://the-guild.dev/graphql/tools/docs/schema-merging#merging-resolvers

// Set up Apollo Server with Federation
const server = new ApolloServer({
  schema: buildFederatedSchema([
    { typeDefs: mergedTypeDefs, resolvers: mergedResolvers },
  ]),
  context: ({ req, res }) => {
    const token = req.cookies.token;
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    return { req, res, user };
  },
});

// Start the server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  app.listen(port, () => {
    console.log(`Community service running on port ${port}`);
    console.log(
      `GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`
    );
  });
};

startServer();
