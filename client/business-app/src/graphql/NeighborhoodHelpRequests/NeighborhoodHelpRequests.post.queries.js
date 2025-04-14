import { gql } from "@apollo/client";

export const GET_HELP_REQUEST_POSTS = gql`
  query getHelpRequestPosts {
    getHelpRequestPosts {
      id
      authorid
      title
      content
      createdAt
      updatedAt
      comments {
        id
        authorid
        postid
        text
        createdAt
      }
    }
  }
`;

export const GET_HELP_REQUEST_POST = gql`
  query Query($getHelpRequestPostId: ID!) {
    getHelpRequestPost(id: $getHelpRequestPostId) {
      id
      authorid
      title
      content
      comments
      createdAt
      updatedAt
    }
  }
`;
