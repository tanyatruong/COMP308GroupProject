const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {

  }

  extend type Mutation {
    addComment(input: CreateHelpRequestCommentInput!): HelpRequestComment!
    # Maybe implement later
    # updateComment(id: ID!, text: String!): HelpRequestComment!
    # deleteComment(id: ID!): Boolean!
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
    author: Resident!
    postId: ID!
    text: String!
    createdAt: String!
  }

  input CreateHelpRequestCommentInput {
    authorId: ID!
    postId: ID!
    text: String!
  }

  # Reference external types
  extend type Resident @key(fields: "id") {
    id: ID! @external
    posts: [Post!]
    comments: [Comment!]
  }
`;

module.exports = { typeDefs };
