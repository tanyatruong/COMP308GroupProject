import { gql } from "@apollo/client";

// attempt at volunteer suggestion
// export const GET_HELP_REQUEST_POSTS = gql`
// query GetHelpRequestPosts {
//   getHelpRequestPosts {
//     id
//     authorid
//     title
//     content
//     author {
//       id
//       role
//       username
//       interests
//       location {
//         id
//         city
//         postalCode
//         address
//       }
//     }
//     comments {
//       id
//       postid
//       authorid
//       text
//       createdAt
//       resident {
//         id
//         role
//         username
//       }
//     }
//   }
// }
// `;
export const GET_HELP_REQUEST_POSTS = gql`
  query GetHelpRequestPosts {
    getHelpRequestPosts {
      id
      authorid
      title
      content
      createdAt
      updatedAt
      author {
        id
        role
        username
      }
      comments {
        id
        authorid
        postid
        text
        createdAt
        resident {
          id
          role
          username
        }
      }
    }
  }
`;
// Old
// export const GET_HELP_REQUEST_POSTS = gql`
//   query getHelpRequestPosts {
//     getHelpRequestPosts {
//       id
//       authorid
//       title
//       content
//       createdAt
//       updatedAt
//       comments {
//         id
//         authorid
//         postid
//         text
//         createdAt
//       }
//     }
//   }
// `;

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
