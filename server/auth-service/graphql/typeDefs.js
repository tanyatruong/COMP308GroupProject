const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Location @key(fields: "id") {
        id: ID!
        city: String!
        postalCode: String!
        address: String!
    }

    type Resident @key(fields: "id") {
        id: ID!
        role: String!
        username: String!
        password: String!
        interests: [String!]!
        location: Location!
        previousEvents: [ID!]
    }
    
    type BusinessOwner @key(fields: "id") {
        id: ID!
        role: String!
        username: String!
        password: String!
    }

    type CommunityOrganizer @key(fields: "id") {
        id: ID!
        role: String!
        username: String!
        password: String!
    }
    
    input LocationInput {
        city: String!
        postalCode: String!
        address: String!
    }
    
    union LoginResult = Resident | BusinessOwner | CommunityOrganizer

    type Query{
        me: LoginResult
    }

    type Mutation {
        resSignup(role: String!, username: String!, password: String!, interests: [String!]!, location: LocationInput!): Resident
        boSignup(role: String!, username: String!, password: String!): BusinessOwner
        coSignup(role: String!, username: String!, password: String!): CommunityOrganizer
        Login(role: String!, username: String!, password: String!): LoginResult
    }
`
module.exports = {typeDefs}