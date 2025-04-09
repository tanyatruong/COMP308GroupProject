const { gql } = require("apollo-server-express");

const typeDefsHelpRequestPost = gql`
  extend type Query {
    getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPosts: [HelpRequestPost!]!
  }

  extend type Mutation {
    createHelpRequestPost(input: CreateHelpRequestPostInput!): HelpRequestPost!
    # updateHelpRequestPost(id: ID!, input: PostUpdateInput!): Post!
    # deleteHelpRequestPost(id: ID!): Boolean!
  }

  type HelpRequestPost @key(fields: "id") {
    id: ID!
    author: Resident!
    title: String!
    content: String!
    comments: [Comment!]
    createdAt: String!
    updatedAt: String!
  }

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
`;

module.exports = { typeDefsHelpRequestPost };
