import { gql } from "@apollo/client";

export const GET_HELP_REQUEST_COMMENT = gql`
  query Query($getHelpRequestCommentId: ID!) {
    getHelpRequestComment(id: $getHelpRequestCommentId) {
      id
      authorid
      postid
      text
      createdAt
    }
  }
`;

export const GET_HELP_REQUEST_COMMENTS_OF_SPECIFIC_HELP_REQUEST_POST = gql`
  query getHelpRequestCommentsOfHelpRequestPost($postid: ID!) {
    getHelpRequestCommentsOfHelpRequestPost(postid: $postid) {
      id
      authorid
      postid
      text
      createdAt
    }
  }
`;
