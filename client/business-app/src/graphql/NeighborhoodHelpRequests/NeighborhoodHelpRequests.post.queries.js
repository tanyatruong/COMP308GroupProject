import { gql } from "@apollo/client";

export const GET_HELP_REQUEST_POSTS = gql`
  query GetHelpRequestPosts {
    getHelpRequestPosts {
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
