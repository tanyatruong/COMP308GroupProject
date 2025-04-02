import { gql } from '@apollo/client';

// Business Profile Queries
export const GET_BUSINESS_PROFILES = gql`
  query GetBusinessProfilesByOwner {
    getBusinessProfilesByOwner {
      id
      businessName
      location {
        address
        city
        postalCode
      }
      description
      images
      averageRating
      businessTags
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUSINESS_PROFILE = gql`
  query GetBusinessProfile($id: ID!) {
    getBusinessProfile(id: $id) {
      id
      businessName
      location {
        address
        city
        postalCode
      }
      description
      images
      averageRating
      businessTags
      createdAt
      updatedAt
    }
  }
`;

// Offers Queries
export const GET_OFFERS_BY_BUSINESS = gql`
  query GetOffersByBusiness($businessId: ID!) {
    getOffersByBusiness(businessId: $businessId) {
      id
      title
      content
      images
      startDate
      endDate
      createdAt
      updatedAt
      business {
        id
        businessName
      }
    }
  }
`;

export const GET_OFFER = gql`
  query GetOffer($id: ID!) {
    getOffer(id: $id) {
      id
      title
      content
      images
      startDate
      endDate
      createdAt
      updatedAt
      business {
        id
        businessName
      }
    }
  }
`;

// Reviews Queries
export const GET_REVIEWS_BY_BUSINESS = gql`
  query GetReviewsByBusiness($businessId: ID!) {
    getReviewsByBusiness(businessId: $businessId) {
      id
      title
      content
      rating
      createdAt
      author
      sentiment {
        score
        label
      }
      responses {
        content
        responseDate
      }
    }
  }
`;