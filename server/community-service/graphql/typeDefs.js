const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post
    
    summarizeDiscussion(posts: [String]!): String!
    analyzeSentiment(reviews: [String]!): String!
    suggestEventVolunteers(tags: [String]!, city: String!): [Resident]!
    suggestHelpRequestVolunteers(tags: [String]!, city: String!): [Resident]!
    suggestEventTime(title: String!, tags: [String]!): String!
  }

  extend type Mutation {
    createPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostUpdateInput!): Post!
    deletePost(id: ID!): Boolean!
    
    addComment(input: CommentInput!): Comment!
    updateComment(id: ID!, text: String!): Comment!
    deleteComment(id: ID!): Boolean!
  }

  type Post @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    author: Resident!
    comments: [Comment!]
    createdAt: String!
    updatedAt: String!
  }

  type Comment @key(fields: "id") {
    id: ID!
    text: String!
    author: Resident!
    postId: ID!
    createdAt: String!
  }

  input PostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  input PostUpdateInput {
    title: String
    content: String
  }

  input CommentInput {
    postId: ID!
    text: String!
    authorId: ID!
  }

  extend type Resident @key(fields: "id") {
    id: ID! @external
    posts: [Post!]
    comments: [Comment!]
  }
`;

module.exports = { typeDefs };
