const { gql } = require("apollo-server-express");

const typeDefsHelpRequestPost = gql`
  extend type Query {
    getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPosts: [HelpRequestPost!]!
  }

  extend type Mutation {
    createHelpRequestPost(input: CreateHelpRequestPostInput!): HelpRequestPost!
    updateHelpRequestPost(
      id: ID!
      input: UpdateHelpRequestPostInput!
    ): HelpRequestPost!
    deleteHelpRequestPost(id: ID!): deletedHelpRequestPostReturnObject
  }

  type HelpRequestPost @key(fields: "id") {
    id: ID!
    authorid: ID!
    title: String!
    content: String!
    comments: [ID!]
    createdAt: String!
    updatedAt: String!
  }

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
`;

module.exports = { typeDefsHelpRequestPost };
