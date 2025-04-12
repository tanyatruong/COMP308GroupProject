const { gql } = require("apollo-server-express");

const typeDefsHelpRequestComment = gql`
  extend type Query {
    getHelpRequestComment(id: ID!): HelpRequestComment!
    getHelpRequestCommentsOfHelpRequestPost(postid: ID!): [HelpRequestComment]!
  }

  extend type Mutation {
    # Create
    createAndAddHelpRequestCommentToHelpRequestPost(
      input: CreateHelpRequestCommentInput!
    ): HelpRequestComment!
    # Maybe implement later
    # updateComment(id: ID!, text: String!): HelpRequestComment!
    deleteHelpRequestComment(id: ID!): deletedHelpRequestCommentReturnObject!
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
    authorid: ID!
    postid: ID!
    text: String!
    createdAt: String!
  }

  input CreateHelpRequestCommentInput {
    authorid: ID!
    postid: ID!
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

module.exports = { typeDefsHelpRequestComment };
