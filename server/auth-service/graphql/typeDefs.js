const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Location @key(fields: "id") {
        id: ID!
        city: String!
        postalCode: String!
        address: String!
    }
    extend type Event @key(fields: "id") {
        id: ID! @external
        author: CommunityOrganizer! @external
        title: String! @external
        description: String! @external
        startDate: String! @external
        endDate: String! @external
        location: Location! @external
        tags: [String!]! @external
        participants: [Resident!]! @external
        maxParticipants: Int @external
        isCancelled: Boolean! @external
        suggestedVolunteers: [Resident!]! @external
        createdAt: String! @external
        updatedAt: String! @external
    }

    type Resident @key(fields: "id") {
        id: ID!
        role: String!
        username: String!
        password: String!
        interests: [String!]!
        location: Location!
        previousEvents: [Event]!
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
        residents: [Resident!]!
    }

    type Mutation {
        resSignup(role: String!, username: String!, password: String!, interests: [String!]!, location: LocationInput!): Resident
        boSignup(role: String!, username: String!, password: String!): BusinessOwner
        coSignup(role: String!, username: String!, password: String!): CommunityOrganizer
        Login(role: String!, username: String!, password: String!): LoginResult
        logout: Boolean
    }
`
module.exports = {typeDefs}