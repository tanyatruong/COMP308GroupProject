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
const tf = require('@tensorflow/tfjs');
const path = require("path");
dotenv.config();
const app = express();
const port = 4003;

app.use(express.json());
app.use(cookieParser());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use('/models', express.static(path.join(__dirname, 'volunteerEventMatching')));
app.use('/models', express.static(path.join(__dirname, 'volunteerHelpRequestMatching')));

let eventModel = null;
const loadEventMatchModel = async () => {
    const modelUrl = `http://localhost:${port}/models/eventMatchModel/model.json`;
    eventModel = await tf.loadLayersModel(modelUrl);
    console.log("Event matching model loaded");
    return eventModel;
}

let helpRequestModel = null;
const loadHelpRequestModel = async () => {
    const modelUrl = `http://localhost:${port}/models/helpRequestMatchModel/model.json`;
    helpRequestModel = await tf.loadLayersModel(modelUrl);
    console.log("Help request model loaded");
    return helpRequestModel;
}

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
        return {user, req, res, genAI, eventModel, helpRequestModel};
    },
});

const startServer = async () => {
    
    
    await server.start();
    server.applyMiddleware({app, cors: false});

    app.listen(port, async () => {
        console.log(`AI service started on port ${port}`);
        await loadEventMatchModel();
        await loadHelpRequestModel();
    });
};

startServer();