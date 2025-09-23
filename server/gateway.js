const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloGateway,
  RemoteGraphQLDataSource,
  IntrospectAndCompose,
} = require("@apollo/gateway");
const cors = require("cors");

const port = process.env.PORT || 4000;
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
      // Render deployment URLs will be added dynamically
      ...(process.env.RENDER_EXTERNAL_URL ? [process.env.RENDER_EXTERNAL_URL] : []),
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

// Construct service URLs for production
const getServiceUrl = (serviceHost, defaultPort, defaultHost = "127.0.0.1") => {
  if (serviceHost) {
    // If it's already a full URL, use it
    if (serviceHost.startsWith('http')) {
      return `${serviceHost}/graphql`;
    }
    // Otherwise, construct the URL
    return `http://${serviceHost}/graphql`;
  }
  return `http://${defaultHost}:${defaultPort}/graphql`;
};

// Log service URLs for debugging
console.log('Service URLs:');
console.log('Community:', getServiceUrl(process.env.COMMUNITY_SERVICE_URL, 4004));
console.log('Auth:', getServiceUrl(process.env.AUTH_SERVICE_URL, 4001));
console.log('Business:', getServiceUrl(process.env.BUSINESS_SERVICE_URL, 4002));
console.log('AI:', getServiceUrl(process.env.AI_SERVICE_URL, 4003));

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { 
        name: "community", 
        url: getServiceUrl(process.env.COMMUNITY_SERVICE_URL, 4004) 
      },
      { 
        name: "auth", 
        url: getServiceUrl(process.env.AUTH_SERVICE_URL, 4001) 
      },
      { 
        name: "business", 
        url: getServiceUrl(process.env.BUSINESS_SERVICE_URL, 4002) 
      },
      { 
        name: "ai", 
        url: getServiceUrl(process.env.AI_SERVICE_URL, 4003) 
      },
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
}).catch((error) => {
  console.error('Failed to start gateway:', error);
  console.log('Retrying in 5 seconds...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});
