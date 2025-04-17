const { gql } = require("apollo-server-express");

const typeDefsHelpRequestPost = gql`
  extend type Query {
    getHelpRequestPost(id: ID!): HelpRequestPost
    getHelpRequestPosts: [HelpRequestPost]!
    # getHelpRequestPosts: [HelpRequestPost] #aggregate version of getPosts
  }

  extend type Mutation {
    createHelpRequestPost(
      input: CreateHelpRequestPostInput!
    ): createHelpRequestPostReturnObject!
    updateHelpRequestPost(
      id: ID!
      input: UpdateHelpRequestPostInput!
    ): HelpRequestPost!
    deleteHelpRequestPost(id: ID!): deletedHelpRequestPostReturnObject
  }

  # before late night work
  # type HelpRequestPost @key(fields: "id") {
  #   id: ID!
  #   authorid: ID!
  #   # authorname: String!
  #   title: String!
  #   content: String!
  #   comments: [HelpRequestComment]
  #   # comments: [ID]!
  #   createdAt: String!
  #   updatedAt: String!
  # }

  # before late night work
  # type HelpRequestComment @key(fields: "id") {
  #   id: ID!
  #   authorid: ID!
  #   # authorname: String!
  #   postid: ID!
  #   text: String!
  #   createdAt: String!
  # }

  # late night work, getPosts includes comment authors
  # type Resident {
  #   id: ID!
  #   username: String!
  #   role: String!
  #   # add more fields if needed
  # }

  # type HelpRequestComment @key(fields: "id") {
  #   id: ID!
  #   authorid: ID!
  #   postid: ID!
  #   text: String!
  #   createdAt: String!
  #   resident: Resident
  # }

  # late night work get posts includes comment authors and post authors
  type HelpRequestPost @key(fields: "id") {
    id: ID!
    authorid: ID!
    title: String!
    content: String!
    comments: [HelpRequestComment]
    createdAt: String!
    updatedAt: String!
    author: Resident!
  }

  type HelpRequestComment @key(fields: "id") {
    id: ID!
    authorid: ID!
    postid: ID!
    text: String!
    createdAt: String!
    resident: Resident
  }

  extend type Location @key(fields: "id") {
    id: ID! @external
    city: String! @external
    postalCode: String! @external
    address: String! @external
  }

  extend type Resident @key(fields: "id") {
    id: ID! @external
    username: String! @external
    role: String! @external
    location: Location! @external
    interests: [String!]! @external
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

  type createHelpRequestPostReturnObject {
    message: String!
    success: Boolean!
    error: String!
    createObjectId: ID
  }

  type deletedHelpRequestPostReturnObject {
    message: String!
    success: Boolean!
    error: String!
    deleteObjectId: ID
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
