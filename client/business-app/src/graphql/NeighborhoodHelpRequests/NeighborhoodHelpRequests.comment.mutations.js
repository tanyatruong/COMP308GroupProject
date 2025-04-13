import { gql } from "@apollo/client";

export const CREATE_AND_ADD_HELP_REQUEST_COMMENT_TO_HELP_REQUEST_POST = gql`
  mutation createAndAddHelpRequestCommentToHelpRequestPost(
    $input: CreateHelpRequestCommentInput!
  ) {
    createAndAddHelpRequestCommentToHelpRequestPost(input: $input) {
      id
      authorid
      postid
      text
      createdAt
    }
  }
`;

export const DELETE_HELP_REQUEST_COMMENT = gql`
  mutation deleteHelpRequestComment($deleteHelpRequestCommentId: ID!) {
    deleteHelpRequestComment(id: $deleteHelpRequestCommentId) {
      message
      success
      error
      deleteObjectId
    }
  }
`;
