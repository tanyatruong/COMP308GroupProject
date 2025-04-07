const {ApolloServer} = require("apollo-server-express");
const {buildFederatedSchema} = require("@apollo/federation");
const express = require("express");
const {typeDefs} = require("./graphql/typeDefs.js");
const {resolvers} = require("./graphql/resolvers.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();
const app = express();
const port = 4003;

app.use(express.json());
app.use(cookieParser());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getUserFromToken = (token) => {
    if(!token)return null;
    try{
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch(err){
        console.error("Invalid token:", err);
        return null;
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    context: ({req, res}) => {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        const user = getUserFromToken(token);
        return {user, req, res, genAI};
    },
});

const startServer = async () => {
    await server.start();
    server.applyMiddleware({app, cors: false});

    app.listen(port, () => {
        console.log(`AI service started on port ${port}`);
    });
};

startServer();