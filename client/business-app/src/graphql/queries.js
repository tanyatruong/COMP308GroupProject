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
        sentimentScore
        sentimentAnalysis
        responses
        createdAt
        author {
          id
          username
        }
      }
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