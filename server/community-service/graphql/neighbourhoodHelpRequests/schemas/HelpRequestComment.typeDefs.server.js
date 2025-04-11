const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    getHelpRequestComment(id: ID!): HelpRequestComment!
    getHelpRequestCommentsOfHelpRequestPost(postid: ID!): [HelpRequestComment]!
  }

  extend type Mutation {
    # Create
    addHelpRequestCommentToHelpRequestPost(
      input: CreateHelpRequestCommentInput!
    ): HelpRequestComment!
    # Maybe implement later
    # updateComment(id: ID!, text: String!): HelpRequestComment!
    deleteHelpRequestComment(id: ID!): deletedHelpRequestCommentReturnObject!
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
    text: String!
    authorid: ID!
    postId: ID!
    createdAt: String!
  }

  input CreateHelpRequestCommentInput {
    authorId: ID!
    postId: ID!
    text: String!
  }

  type deletedHelpRequestCommentReturnObject {
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
`;

module.exports = { typeDefs };
