const { gql } = require("apollo-server-express");

<<<<<<< HEAD
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
=======
const typeDefsHelpRequestComment = gql`
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)
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
<<<<<<< HEAD
    # deleteComment(id: ID!): Boolean!
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
    deleteHelpRequestComment(id: ID!): deletedHelpRequestCommentReturnObject!
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    authorid: ID!
    postid: ID!
=======
    author: Resident!
    postId: ID!
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
>>>>>>> 890cb28 (HelpRequestPosts Backend (except gateway) done)
    text: String!
=======
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)
    authorid: ID!
    postid: ID!
    text: String!
    createdAt: String!
  }

  input CreateHelpRequestCommentInput {
<<<<<<< HEAD
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
=======
    authorid: ID!
    postid: ID!
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)
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

<<<<<<< HEAD
module.exports = { typeDefs };
>>>>>>> bcfec50 (mongo models for HelpRequest Post and comment complete. Post Resolver/typdef in progress. indexjs updated to aggregate resolvers and typeDefs)
=======
module.exports = { typeDefsHelpRequestComment };
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)
