import { gql } from "@apollo/client";

export const GET_HELP_REQUEST_POSTS = gql`
  query getHelpRequestPosts {
    getHelpRequestPosts {
      id
      authorid
      title
      content
      comments {
        id
        text
        authorid
        postId
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_HELP_REQUEST_POST = gql`
  query getHelpRequestPost($getHelpRequestPostId: ID!) {
    getHelpRequestPost(id: $getHelpRequestPostId) {
      id
      authorid
      title
      content
      comments {
        id
        text
        authorid
        postId
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;
