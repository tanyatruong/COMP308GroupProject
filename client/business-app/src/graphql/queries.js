import { gql } from '@apollo/client';

export const GET_BUSINESS_PROFILE = gql`
query GetBusinessProfileByOwner($ownerId: ID!) {
    businessProfileByOwner(ownerId: $ownerId) {
      id
      businessName
      description
      images
      averageRating
      businessTags
      location {
        id
        city
        postalCode
        address
      }
      offers {
        id
        title
        content
        isActive
        expiresAt
        createdAt
      }
      reviews {
        id
        title
        content
        rating
        sentimentAnalysis
        responses
        createdAt
      }
    }
  }
`;

export const CREATE_BUSINESS_PROFILE = gql`
  mutation CreateBusinessProfile($input: BusinessProfileInput!) {
    createBusinessProfile(input: $input) {
      id
      businessName
      description
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      startDate
      endDate
      tags
      participants {
        id
        username
      }
      isCancelled
    }
  }
`;

export const GET_EVENTS_BY_ORGANIZER = gql`
  query GetEventsByOrganizer($organizerId: ID!) {
    eventsByOrganizer(organizerId: $organizerId) {
      id
      title
      description
      startDate
      endDate
      tags
      location {
        city
        address
      }
      participants {
        id
        username
      }
      isCancelled
    }
  }
`;

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    upcomingEvents {
      id
      title
      description
      startDate
      endDate
      tags
      location {
        city
        address
      }
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        id
        username
      }
      comments {
        id
      }
    }
  }
`;

export const GET_POST_WITH_COMMENTS = gql`
  query GetPostWithComments($postId: ID!) {
    post(id: $postId) {
      id
      title
      content
      createdAt
      author {
        id
        username
      }
      comments {
        id
        text
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;
