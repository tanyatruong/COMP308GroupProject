const {gql} = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        analyzeSentiment(reviews: [String]!): String!
        summarizeDiscussion(posts: [String]!): String!
    }
`

module.exports = {typeDefs}