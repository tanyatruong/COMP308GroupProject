import { gql } from "@apollo/client";

export const CREATE_HELP_REQUEST_POST = gql`
  mutation CreateHelpRequestPost($input: CreateHelpRequestPostInput!) {
    createHelpRequestPost(input: $input) {
      message
      success
      error
      createObjectId
    }
  }
`;

export const UPDATE_HELP_REQUEST_POST = gql`
  mutation UpdateHelpRequestPost(
    $updateHelpRequestPostId: ID!
    $input: UpdateHelpRequestPostInput!
  ) {
    updateHelpRequestPost(id: $updateHelpRequestPostId, input: $input) {
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
export const DELETE_HELP_REQUEST_POST = gql`
  mutation DeleteHelpRequestPost($deleteHelpRequestPostId: ID!) {
    deleteHelpRequestPost(id: $deleteHelpRequestPostId) {
      message
      success
      error
      deleteObjectId
    }
  }
`;
