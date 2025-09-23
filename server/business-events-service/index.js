const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const { typeDefs } = require('./graphql/typeDefs.js');
const { resolvers } = require('./graphql/resolvers.js');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:3003', 
        'http://localhost:5173', 
        'https://studio.apollographql.com',
        // Render deployment URLs will be added dynamically
        ...(process.env.RENDER_EXTERNAL_URL ? [process.env.RENDER_EXTERNAL_URL] : []),
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
}));

// Authentication middleware to extract user from JWT token
const getUserFromToken = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

// Create Apollo Server
const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req, res }) => {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        const user = getUserFromToken(token);
        return { user, req, res };
    },
});

// Start server function
const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app, cors: false });

    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

    // Start Express server
    app.listen(PORT, () => {
        console.log(`Business & Events Service running at http://localhost:${PORT}${server.graphqlPath}`);
    });
};

// Handle errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Start the server
startServer();