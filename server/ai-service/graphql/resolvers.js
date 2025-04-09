const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const tf = require('@tensorflow/tfjs-node');
dotenv.config();

const gatewayEndpoint = 'http://localhost:4000/graphql';

const getResidents = async () => {
    const GET_RESIDENTS = `
    query GetResidents {
        residents {
            id
            username
            interests
            previousEvents {
                id
            }
            location {
                city
            }
        }
    }
    `; 
    const requestBody = {
        query: GET_RESIDENTS,
    }
    //using fetch because graphql-request is not working
    try{
        const response = await fetch(gatewayEndpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        //console.log(JSON.stringify(data, null, 2));
        if (data.errors) {
            console.error("GraphQL Errors:", data.errors); 
            throw new Error("Error fetching residents.");
        }
        return data.data.residents;
    } catch(err){
        console.error("Error fetching residents:", err);
        throw new Error("Error fetching residents.");
    } 
} 




const resolvers = {
    Query: {
        analyzeSentiment: async (_, { reviews }, { user, genAI }) => {
            if (!user) {
                throw new Error("Unauthorized access. Please log in.");
            }
            if (reviews.length === 0){
                return "No reviews";
            }
            const response = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `
                    Analyze the sentiment of the following reviews and provide a short summary.
                    Provide only a paragraph summarizing the sentiment of the reviews with no other characters or text.
                    ${reviews.join('\n')}
                `
            });
            return response.text;
        },
        summarizeDiscussion: async (_, { posts }, { user, genAI}) => {
            if (!user) {
                throw new Error("Unauthorized access. Please log in.");
            }
            if (posts.length === 0){
                return "No posts";
            }
            const response = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `
                    Summarize the following discussion posts and provide a short summary of the topics discussed.
                    Provide only a paragraph summarizing the discussion with no other characters or text.
                    ${posts.join('\n')}
                `
            });
            return response.text;
        },
        suggestEventVolunteers: async (_, { tags, city }, { user, eventModel}) => {
            // if (!user) {
            //     throw new Error("Unauthorized access. Please log in.");
            // }
            try{
                const residents = await getResidents();
                console.log(JSON.stringify(residents, null, 2));

                const inputData = residents.map((resident) => {
                    const matchingInterest = tags.some(tag => resident.interests.includes(tag)) ? 1 : 0;
                    const matchingLocation = resident.location.city === city ? 1 : 0;
                    const matchingPreviousEvent = resident.previousEvents.some(evt => {
                        return evt.tags.some(tag => tags.includes(tag));
                    });
                    const matchingEvent = matchingPreviousEvent ? 1 : 0;

                    return [matchingInterest, matchingLocation, matchingEvent];
                });

                const inputTensor = tf.tensor2d(inputData);
                console.log("Input Tensor:", inputTensor.toString());
                const predictions = eventModel.predict(inputTensor);
                const predictionData = predictions.dataSync();
                console.log(predictionData);
                const suggestedResidents = residents.filter((resident, index) => {
                    return predictionData[index] > 0.5;
                })
                console.log(suggestedResidents);
                return suggestedResidents;
            } catch(err){
                console.error("Error suggesting volunteers:", err);
                throw new Error("Error suggesting volunteers.");
            }
        },
        suggestHelpRequestVolunteers: async (_, { tags, city}, { user, helpRequestModel}) => {
            try {
                const residents = await getResidents();
                const inputData = residents.map((resident) => {
                    const matchingInterest = tags.some(tag => resident.interests.includes(tag)) ? 1 : 0;
                    const matchingLocation = resident.location.city === city ? 1 : 0;
                    return [matchingInterest, matchingLocation];
                });

                const inputTensor = tf.tensor2d(inputData);
                const predictions = helpRequestModel.predict(inputTensor);
                const predictionData = predictions.dataSync();

                const suggestedResidents = residents.filter((resident, index) => {
                    return predictionData[index] > 0.5;
                });
                
                return suggestedResidents;
            } catch(err){
                console.error("Error suggesting volunteers:", err);
                throw new Error("Error suggesting volunteers.");
            }
        }
        
    }
}

module.exports = { resolvers };