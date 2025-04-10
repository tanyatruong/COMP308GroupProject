const {gql} = require("apollo-server-express");

const typeDefs = gql`
    extend type Query {
        analyzeSentiment(reviews: [String]!): String!
        summarizeDiscussion(posts: [String]!): String!
        suggestEventVolunteers(tags: [String]!, city: String!) : [Resident]!
        suggestHelpRequestVolunteers(tags: [String]!, city: String!) : [Resident]!
        suggestEventTime(title: String!, tags: [String]!): String!
    }
    extend type Location @key(fields: "id") {
        id: ID! @external
        city: String! @external
        postalCode: String! @external
        address: String! @external
    }
    extend type Resident @key(fields: "id") {
        id: ID! @external
        role: String! @external
        username: String! @external
        password: String! @external
        interests: [String!]! @external
        location: Location! @external
        previousEvents: [ID!] @external
    }
`

module.exports = {typeDefs}