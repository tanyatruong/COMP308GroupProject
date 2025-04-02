import { gql } from '@apollo/client';

// Business Profile Mutations
export const CREATE_BUSINESS_PROFILE = gql`
  mutation CreateBusinessProfile($input: BusinessProfileInput!) {
    createBusinessProfile(input: $input) {
      id
      businessName
      location {
        address
        city
        postalCode
      }
      description
      images
      businessTags
    }
  }
`;

export const UPDATE_BUSINESS_PROFILE = gql`
  mutation UpdateBusinessProfile($id: ID!, $input: BusinessProfileInput!) {
    updateBusinessProfile(id: $id, input: $input) {
      id
      businessName
      location {
        address
        city
        postalCode
      }
      description
      images
      businessTags
      updatedAt
    }
  }
`;

export const DELETE_BUSINESS_PROFILE = gql`
  mutation DeleteBusinessProfile($id: ID!) {
    deleteBusinessProfile(id: $id)
  }
`;

// Offers Mutations
export const CREATE_OFFER = gql`
  mutation CreateOffer($input: OfferInput!) {
    createOffer(input: $input) {
      id
      title
      content
      images
      startDate
      endDate
      business {
        id
        businessName
      }
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation UpdateOffer($id: ID!, $input: OfferInput!) {
    updateOffer(id: $id, input: $input) {
      id
      title
      content
      images
      startDate
      endDate
      updatedAt
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id)
  }
`;

// Review Mutations
export const RESPOND_TO_REVIEW = gql`
  mutation RespondToReview($input: ResponseInput!) {
    respondToReview(input: $input) {
      id
      responses {
        content
        responseDate
      }
    }
  }
`;