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

// Health check function
const checkServiceHealth = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Wait for services to be ready
const waitForServices = async (serviceUrls, maxRetries = 30, delay = 2000) => {
  console.log('Waiting for services to be ready...');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries}: Checking service health...`);
    
    const healthChecks = await Promise.all(
      serviceUrls.map(async (url) => {
        const isHealthy = await checkServiceHealth(url);
        console.log(`${url}: ${isHealthy ? '✅ Ready' : '❌ Not ready'}`);
        return isHealthy;
      })
    );
    
    if (healthChecks.every(healthy => healthy)) {
      console.log('✅ All services are ready!');
      return true;
    }
    
    if (attempt < maxRetries) {
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('❌ Services not ready after maximum retries');
  return false;
};

// Log service URLs for debugging
console.log('Service URLs:');
console.log('Community:', getServiceUrl(process.env.COMMUNITY_SERVICE_URL, 4004));
console.log('Auth:', getServiceUrl(process.env.AUTH_SERVICE_URL, 4001));
console.log('Business:', getServiceUrl(process.env.BUSINESS_SERVICE_URL, 4002));
console.log('AI:', getServiceUrl(process.env.AI_SERVICE_URL, 4003));

const serviceUrls = [
  getServiceUrl(process.env.COMMUNITY_SERVICE_URL, 4004),
  getServiceUrl(process.env.AUTH_SERVICE_URL, 4001),
  getServiceUrl(process.env.BUSINESS_SERVICE_URL, 4002),
  getServiceUrl(process.env.AI_SERVICE_URL, 4003)
];

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { 
        name: "community", 
        url: serviceUrls[0] 
      },
      { 
        name: "auth", 
        url: serviceUrls[1] 
      },
      { 
        name: "business", 
        url: serviceUrls[2] 
      },
      { 
        name: "ai", 
        url: serviceUrls[3] 
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

// Start server with health checks
const startServer = async () => {
  try {
    // Wait for services to be ready
    const servicesReady = await waitForServices(serviceUrls);
    
    if (!servicesReady) {
      console.error('❌ Failed to start gateway: Services not ready');
      process.exit(1);
    }
    
    // Start the gateway
    await server.start();
    server.applyMiddleware({ app, cors: false });
    
    app.listen({ port: port }, () => {
      console.log(`✅ Gateway running on port ${port}`);
      console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Failed to start gateway:', error);
    process.exit(1);
  }
};

startServer();
