const {ApolloServer} = require('apollo-server-express');
const {buildFederatedSchema} = require('@apollo/federation');
const express = require('express');
const {typeDefs} = require('./graphql/typeDefs.js');
const {resolvers} = require('./graphql/resolvers.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') })

console.log('SECRET_KEY loaded:', process.env.SECRET_KEY ? 'YES' : 'NO');
console.log('SECRET_KEY length:', process.env.SECRET_KEY ? process.env.SECRET_KEY.length : 0);

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cookieParser());

// Add CORS support
app.use(cors({
    origin: [
        'http://localhost:3001', 
        'http://localhost:3003', 
        'http://localhost:5173',
        'https://studio.apollographql.com',
        // Render deployment URLs will be added dynamically
        ...(process.env.RENDER_EXTERNAL_URL ? [process.env.RENDER_EXTERNAL_URL] : []),
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
}));

// Add route to clear tokens
app.get('/clear-tokens', (req, res) => {
    res.clearCookie('token', {
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });
    res.json({ message: 'Tokens cleared successfully' });
});

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    context: ({req, res}) => {
        const token = req.cookies.token;
        console.log('Auth service context - token present:', !!token);
        let user = null;
        if(token){
            try{
                user = jwt.verify(token, process.env.SECRET_KEY);
                console.log('Auth service context - user verified:', user);
            } catch(err){
                console.error("invalid token - clearing cookie", err.message);
                // Clear the invalid token cookie
                res.clearCookie('token', {
                    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
                });
            }
        }
        return {req, res, user}
    },
});

const startServer = async () => {
    await server.start();
    server.applyMiddleware({app});

    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

    app.listen(port, () => {
        console.log(`Auth service started on port ${port}`);
    })
}
startServer();