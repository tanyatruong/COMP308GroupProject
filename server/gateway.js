const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloGateway,
  RemoteGraphQLDataSource,
  IntrospectAndCompose,
} = require("@apollo/gateway");
const cors = require("cors");

const port = 4000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3003",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:3003",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://studio.apollographql.com",
    ],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "community", url: "http://127.0.0.1:4004/graphql" },
      { name: "auth", url: "http://127.0.0.1:4001/graphql" },
      { name: "business", url: "http://127.0.0.1:4002/graphql" },
      { name: "ai", url: "http://127.0.0.1:4003/graphql" },
    ],
  }),
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        if (context.req && context.req.headers.cookie) {
          request.http.headers.set("Cookie", context.req.headers.cookie);
        }
      },
      didReceiveResponse({ response, context }) {
        const setCookieHeader = response.http.headers.get("set-cookie");
        if (setCookieHeader && context.res) {
          context.res.setHeader("Set-Cookie", setCookieHeader);
          context.res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
        }
        return response;
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req, res }) => ({ req, res }),
});

server.start().then(() => {
  server.applyMiddleware({ app, cors: false });
  app.listen({ port: port }, () => {
    console.log(`Gateway running on port ${port}`);
    console.log(
      `GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`
    );
  });
});
