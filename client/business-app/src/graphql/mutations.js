import { gql } from '@apollo/client';

export const CREATE_BUSINESS_PROFILE = gql`
  mutation CreateBusinessProfile($input: BusinessProfileInput!) {
    createBusinessProfile(input: $input) {
      id
      businessName
      description
      businessTags
      location {
        id
        city
        postalCode
        address
      }
    }
  }
`;

export const UPDATE_BUSINESS_PROFILE = gql`
  mutation UpdateBusinessProfile($id: ID!, $input: BusinessProfileUpdateInput!) {
    updateBusinessProfile(id: $id, input: $input) {
      id
      businessName
      description
      businessTags
    }
  }
`;

export const CREATE_OFFER = gql`
  mutation CreateOffer($input: OfferInput!) {
    createOffer(input: $input) {
      id
      title
      content
      images
      expiresAt
      isActive
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation UpdateOffer($id: ID!, $input: OfferUpdateInput!) {
    updateOffer(id: $id, input: $input) {
      id
      title
      content
      images
      expiresAt
      isActive
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id)
  }
`;

export const RESPOND_TO_REVIEW = gql`
  mutation RespondToReview($reviewId: ID!, $response: String!) {
    respondToReview(reviewId: $reviewId, response: $response) {
      id
      responses
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      startDate
      endDate
      tags
      location {
        id
        city
        postalCode
        address
      }
    }
  }
`;

export const CANCEL_EVENT = gql`
  mutation CancelEvent($id: ID!) {
    cancelEvent(id: $id) {
      id
      isCancelled
    }
  }
`;

export const SUGGEST_VOLUNTEERS = gql`
  mutation SuggestVolunteers($eventId: ID!) {
    suggestVolunteersForEvent(eventId: $eventId) {
      id
      username
    }
  }
`;