const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Location {
    address: String!
    city: String!
    postalCode: String!
  }

  type BusinessProfile {
    id: ID!
    businessName: String!
    businessOwner: ID!
    location: Location!
    description: String!
    images: [String]
    averageRating: Float
    businessTags: [String]
    createdAt: String
    updatedAt: String
  }

  type Offer {
    id: ID!
    title: String!
    content: String!
    images: [String]
    business: BusinessProfile!
    startDate: String!
    endDate: String
    createdAt: String!
    updatedAt: String!
  }

  type Sentiment {
    score: Float
    label: String
  }

  type Response {
    content: String!
    responseDate: String!
  }

  type Review {
    id: ID!
    businessProfile: BusinessProfile!
    author: ID!
    title: String!
    content: String!
    rating: Int!
    sentiment: Sentiment
    responses: [Response]
    createdAt: String!
    updatedAt: String!
  }

  input LocationInput {
    address: String!
    city: String!
    postalCode: String!
  }

  input BusinessProfileInput {
    businessName: String!
    location: LocationInput!
    description: String!
    images: [String]
    businessTags: [String]
  }

  input OfferInput {
    title: String!
    content: String!
    images: [String]
    businessId: ID!
    startDate: String
    endDate: String
  }

  input ReviewInput {
    businessProfileId: ID!
    title: String!
    content: String!
    rating: Int!
  }

  input ResponseInput {
    reviewId: ID!
    content: String!
  }

  type Query {
    # Business Profiles
    getBusinessProfile(id: ID!): BusinessProfile
    getBusinessProfilesByOwner: [BusinessProfile]
    searchBusinesses(query: String): [BusinessProfile]
    getAllBusinessProfiles: [BusinessProfile]
    
    # Offers
    getOffer(id: ID!): Offer
    getOffersByBusiness(businessId: ID!): [Offer]
    getAllOffers: [Offer]
    
    # Reviews
    getReview(id: ID!): Review
    getReviewsByBusiness(businessId: ID!): [Review]
    getReviewsByAuthor(authorId: ID!): [Review]
  }

  type Mutation {
    # Business Profiles
    createBusinessProfile(input: BusinessProfileInput!): BusinessProfile
    updateBusinessProfile(id: ID!, input: BusinessProfileInput!): BusinessProfile
    deleteBusinessProfile(id: ID!): Boolean
    
    # Offers
    createOffer(input: OfferInput!): Offer
    updateOffer(id: ID!, input: OfferInput!): Offer
    deleteOffer(id: ID!): Boolean
    
    # Reviews
    createReview(input: ReviewInput!): Review
    respondToReview(input: ResponseInput!): Review
    deleteReview(id: ID!): Boolean
  }
`;

module.exports = typeDefs;