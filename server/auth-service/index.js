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
dotenv.config()

const app = express();
const port = 4001;

app.use(express.json());
app.use(cookieParser());

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    context: ({req, res}) => {
        const token = req.cookies.token;
        let user = null;
        if(token){
            try{
                user = jwt.verify(token, process.env.SECRET_KEY);
            } catch(err){
                console.error("invalid token", err);
            }
        }
        return {req, res, user}
    },
});

const startServer = async () => {
    await server.start();
    server.applyMiddleware({app});

    mongoose.connect(process.env.MONGO_URI);

    app.listen(port, () => {
        console.log(`Auth service started on port ${port}`);
    })
}
startServer();