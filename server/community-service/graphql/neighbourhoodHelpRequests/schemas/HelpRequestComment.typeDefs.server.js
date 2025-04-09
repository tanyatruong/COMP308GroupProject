const { gql } = require("apollo-server-express");

<<<<<<< HEAD
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
=======
const typeDefs = gql`
  extend type Query {

  }

  extend type Mutation {
    addComment(input: CreateHelpRequestCommentInput!): HelpRequestComment!
    # Maybe implement later
    # updateComment(id: ID!, text: String!): HelpRequestComment!
    # deleteComment(id: ID!): Boolean!
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
<<<<<<< HEAD
    authorid: ID!
    postid: ID!
=======
    author: Resident!
    postId: ID!
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
    text: String!
    createdAt: String!
  }

  input CreateHelpRequestCommentInput {
<<<<<<< HEAD
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
=======
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
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
