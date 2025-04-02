const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import GraphQL schema components
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// Create Express app
const app = express();

// Configure middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'https://studio.apollographql.com'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-service-db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    // Get the user token from the cookies
    const token = req.cookies.token || '';
    
    // Try to retrieve a user with the token
    let user = null;
    try {
      if (token) {
        // Verify token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        user = decoded;
      }
    } catch (err) {
      console.error('Invalid token');
    }
    
    // Add the user to the context
    return { user, res };
  }
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql', cors: false });
  
  // Set port and start server
  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.log(`Business service running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();