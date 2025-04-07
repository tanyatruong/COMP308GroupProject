const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

dotenv.config();

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
        }
        
    }
}

module.exports = { resolvers };