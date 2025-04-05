const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    businessProfiles: [BusinessProfile!]!
    businessProfile(id: ID!): BusinessProfile
    businessProfileByOwner(ownerId: ID!): BusinessProfile
    offers: [Offer!]!
    offer(id: ID!): Offer
    offersByBusiness(businessId: ID!): [Offer!]!
    reviews: [Review!]!
    review(id: ID!): Review
    reviewsByBusiness(businessId: ID!): [Review!]!
    
    # Event queries
    events: [Event!]!
    event(id: ID!): Event
    eventsByOrganizer(organizerId: ID!): [Event!]!
    upcomingEvents: [Event!]!
    eventsByTag(tag: String!): [Event!]!
  }

  extend type Mutation {
    createBusinessProfile(input: BusinessProfileInput!): BusinessProfile!
    updateBusinessProfile(id: ID!, input: BusinessProfileUpdateInput!): BusinessProfile!
    deleteBusinessProfile(id: ID!): Boolean!
    
    createOffer(input: OfferInput!): Offer!
    updateOffer(id: ID!, input: OfferUpdateInput!): Offer!
    deleteOffer(id: ID!): Boolean!
    
    createReview(input: ReviewInput!): Review!
    respondToReview(reviewId: ID!, response: String!): Review!
    deleteReview(id: ID!): Boolean!
    
    # Event mutations
    createEvent(input: EventInput!): Event!
    updateEvent(id: ID!, input: EventUpdateInput!): Event!
    cancelEvent(id: ID!): Event!
    joinEvent(eventId: ID!, residentId: ID!): Event!
    leaveEvent(eventId: ID!, residentId: ID!): Event!
    
    # AI volunteer matching
    suggestVolunteersForEvent(eventId: ID!): [Resident!]!
  }

  type BusinessProfile @key(fields: "id") {
    id: ID!
    businessName: String!
    businessOwner: BusinessOwner!
    location: Location!
    description: String!
    images: [String!]
    offers: [Offer!]
    averageRating: Float
    reviews: [Review!]
    businessTags: [String!]
    createdAt: String!
    updatedAt: String!
  }

  type Offer @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    images: [String!]
    business: BusinessProfile!
    expiresAt: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Review @key(fields: "id") {
    id: ID!
    businessProfile: BusinessProfile!
    author: Resident!
    title: String!
    content: String!
    rating: Int!
    sentimentScore: Float
    sentimentAnalysis: String
    responses: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  input BusinessProfileInput {
    businessName: String!
    businessOwnerId: ID!
    locationInput: LocationInput!
    description: String!
    images: [String!]
    businessTags: [String!]
  }

  input LocationInput {
    city: String!
    postalCode: String!
    address: String!
  }

  input BusinessProfileUpdateInput {
    businessName: String
    description: String
    images: [String!]
    businessTags: [String!]
  }

  input OfferInput {
    title: String!
    content: String!
    images: [String!]
    businessId: ID!
    expiresAt: String
  }

  input OfferUpdateInput {
    title: String
    content: String
    images: [String!]
    expiresAt: String
    isActive: Boolean
  }

  input ReviewInput {
    businessProfileId: ID!
    authorId: ID!
    title: String!
    content: String!
    rating: Int!
  }
  
  type Event @key(fields: "id") {
    id: ID!
    author: CommunityOrganizer!
    title: String!
    description: String!
    startDate: String!
    endDate: String!
    location: Location!
    tags: [String!]!
    participants: [Resident!]!
    maxParticipants: Int
    isCancelled: Boolean!
    suggestedVolunteers: [Resident!]!
    createdAt: String!
    updatedAt: String!
  }
  
  input EventInput {
    authorId: ID!
    title: String!
    description: String!
    startDate: String!
    endDate: String!
    locationInput: LocationInput
    locationId: ID
    tags: [String!]!
    maxParticipants: Int
  }
  
  input EventUpdateInput {
    title: String
    description: String
    startDate: String
    endDate: String
    locationId: ID
    tags: [String!]
    maxParticipants: Int
  }

  extend type BusinessOwner @key(fields: "id") {
    id: ID! @external
    businessProfiles: [BusinessProfile!]
  }

  extend type Resident @key(fields: "id") {
    id: ID! @external
    reviews: [Review!]
  }

  extend type CommunityOrganizer @key(fields: "id") {
    id: ID! @external
    createdEvents: [Event!]
  }
  
  extend type Location @key(fields: "id") {
    id: ID! @external
  }
`;

module.exports = { typeDefs };