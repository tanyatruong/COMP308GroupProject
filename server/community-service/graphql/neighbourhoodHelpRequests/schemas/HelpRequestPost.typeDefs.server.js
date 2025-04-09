const { gql } = require("apollo-server-express");

const typeDefsHelpRequestPost = gql`
  extend type Query {
    getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPosts: [HelpRequestPost!]!
  }

  extend type Mutation {
    createHelpRequestPost(input: CreateHelpRequestPostInput!): HelpRequestPost!
<<<<<<< HEAD
    updateHelpRequestPost(
      id: ID!
      input: UpdateHelpRequestPostInput!
    ): HelpRequestPost!
    deleteHelpRequestPost(id: ID!): deletedHelpRequestPostReturnObject
=======
    # updateHelpRequestPost(id: ID!, input: PostUpdateInput!): Post!
    # deleteHelpRequestPost(id: ID!): Boolean!
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
  }

  type HelpRequestPost @key(fields: "id") {
    id: ID!
<<<<<<< HEAD
    authorid: ID!
    title: String!
    content: String!
    comments: [ID!]
=======
    author: Resident!
    title: String!
    content: String!
    comments: [Comment!]
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
    createdAt: String!
    updatedAt: String!
  }

<<<<<<< HEAD
  input CreateHelpRequestPostInput {
    title: String!
    content: String!
    authorid: ID!
  }

  input UpdateHelpRequestPostInput {
    title: String
    content: String
  }

  type deletedHelpRequestPostReturnObject {
    message: String!
    success: Boolean!
    error: String!
    deleteObjectId: ID!
  }

  # Reference external types
  # extend type Resident @key(fields: "id") {
  #   id: ID! @external
  #   posts: [Post!]
  #   comments: [Comment!]
  # }

  # type HelpRequestComment @key(fields: "id") {
  #   id: ID!
  #   text: String!
  #   authorid: ID!
  #   postId: ID!
  #   createdAt: String!
  # }
=======
  type HelpRequestComment @key(fields: "id") {
    id: ID!
    text: String!
    author: Resident!
    postId: ID!
    createdAt: String!
  }

  input CreateHelpRequestPostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  #   input UpdatePostInput {
  #     title: String
  #     content: String
  #   }

  # Reference external types
  extend type Resident @key(fields: "id") {
    id: ID! @external
    posts: [Post!]
    comments: [Comment!]
  }
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
`;

module.exports = { typeDefsHelpRequestPost };
