const { BusinessProfile } = require('../models/BusinessProfile');
const { Offer } = require('../models/Offer');
const { Review } = require('../models/Review');
const { Event } = require('../models/Event');
const { Location } = require('../models/Location');
const { analyzeReviewSentiment } = require('../services/aiService');
const { findVolunteersForEvent } = require('../services/aiVolunteerService');

const resolvers = {
  BusinessProfile: {
    __resolveReference: async (ref) => {
      return await BusinessProfile.findById(ref.id);
    },
    offers: async (parent) => {
      return await Offer.find({ business: parent.id });
    },
    reviews: async (parent) => {
      return await Review.find({ businessProfile: parent.id });
    },
    businessOwner: async (parent) => {
      return { __typename: 'BusinessOwner', id: parent.businessOwner };
    },
    location: async (parent) => {
      return { __typename: 'Location', id: parent.location };
    }
  },
  Offer: {
    __resolveReference: async (ref) => {
      return await Offer.findById(ref.id);
    },
    business: async (parent) => {
      return { __typename: 'BusinessProfile', id: parent.business };
    }
  },
  Review: {
    __resolveReference: async (ref) => {
      return await Review.findById(ref.id);
    },
    businessProfile: async (parent) => {
      return { __typename: 'BusinessProfile', id: parent.businessProfile };
    },
    author: async (parent) => {
      return { __typename: 'Resident', id: parent.author };
    }
  },
  BusinessOwner: {
    businessProfiles: async (parent) => {
      return await BusinessProfile.find({ businessOwner: parent.id });
    }
  },
  Resident: {
    reviews: async (parent) => {
      return await Review.find({ author: parent.id });
    }
  },
  
  Event: {
    __resolveReference: async (ref) => {
      return await Event.findById(ref.id);
    },
    author: async (parent) => {
      return { __typename: 'CommunityOrganizer', id: parent.author };
    },
    location: async (parent) => {
      return { __typename: 'Location', id: parent.location };
    },
    participants: async (parent) => {
      return parent.participants.map(id => ({ __typename: 'Resident', id }));
    },
    suggestedVolunteers: async (parent) => {
      return parent.suggestedVolunteers.map(id => ({ __typename: 'Resident', id }));
    }
  },
  
  CommunityOrganizer: {
    createdEvents: async (parent) => {
      return await Event.find({ author: parent.id });
    }
  },
  Query: {
    businessProfiles: async () => {
      return await BusinessProfile.find();
    },
    businessProfile: async (_, { id }) => {
      return await BusinessProfile.findById(id);
    },
    businessProfileByOwner: async (_, { ownerId }) => {
      return await BusinessProfile.findOne({ businessOwner: ownerId });
    },
    offers: async () => {
      return await Offer.find();
    },
    offer: async (_, { id }) => {
      return await Offer.findById(id);
    },
    offersByBusiness: async (_, { businessId }) => {
      return await Offer.find({ business: businessId });
    },
    reviews: async () => {
      return await Review.find();
    },
    review: async (_, { id }) => {
      return await Review.findById(id);
    },
    reviewsByBusiness: async (_, { businessId }) => {
      return await Review.find({ businessProfile: businessId });
    },
    
    // Event queries
    events: async () => {
      return await Event.find({ isCancelled: false });
    },
    
    event: async (_, { id }) => {
      return await Event.findById(id);
    },
    
    eventsByOrganizer: async (_, { organizerId }) => {
      return await Event.find({ author: organizerId });
    },
    
    upcomingEvents: async () => {
      const now = new Date();
      return await Event.find({ 
        startDate: { $gte: now },
        isCancelled: false
      }).sort({ startDate: 1 });
    },
    
    eventsByTag: async (_, { tag }) => {
      return await Event.find({ 
        tags: tag,
        isCancelled: false
      });
    }
  },
  Mutation: {
    createBusinessProfile: async (_, { input }) => {
      // Check if a location already exists, otherwise create a new one
      let locationId;
      const { locationInput, businessOwnerId, ...businessData } = input;
      
      const existingLocation = await Location.findOne({
        city: locationInput.city,
        postalCode: locationInput.postalCode,
        address: locationInput.address
      });
      
      if (existingLocation) {
        locationId = existingLocation.id;
      } else {
        const newLocation = new Location({
          city: locationInput.city,
          postalCode: locationInput.postalCode,
          address: locationInput.address
        });
        await newLocation.save();
        locationId = newLocation.id;
      }
      
      const businessProfile = new BusinessProfile({
        ...businessData,
        businessOwner: businessOwnerId,
        location: locationId
      });
      
      await businessProfile.save();
      return businessProfile;
    },
    
    updateBusinessProfile: async (_, { id, input }) => {
      const updatedProfile = await BusinessProfile.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );
      
      if (!updatedProfile) {
        throw new Error('Business profile not found');
      }
      
      return updatedProfile;
    },
    
    deleteBusinessProfile: async (_, { id }) => {
      const result = await BusinessProfile.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error('Business profile not found');
      }
      
      // Remove associated offers and reviews
      await Offer.deleteMany({ business: id });
      await Review.deleteMany({ businessProfile: id });
      
      return true;
    },
    
    createOffer: async (_, { input }) => {
      const { businessId, ...offerData } = input;
      
      // Check if business exists
      const businessExists = await BusinessProfile.findById(businessId);
      if (!businessExists) {
        throw new Error('Business profile not found');
      }
      
      const offer = new Offer({
        ...offerData,
        business: businessId
      });
      
      await offer.save();
      
      // Update the business profile to include this offer
      await BusinessProfile.findByIdAndUpdate(
        businessId,
        { $push: { offers: offer.id } }
      );
      
      return offer;
    },
    
    updateOffer: async (_, { id, input }) => {
      const updatedOffer = await Offer.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      );
      
      if (!updatedOffer) {
        throw new Error('Offer not found');
      }
      
      return updatedOffer;
    },
    
    deleteOffer: async (_, { id }) => {
      const offer = await Offer.findById(id);
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Remove the offer from the business profile
      await BusinessProfile.findByIdAndUpdate(
        offer.business,
        { $pull: { offers: id } }
      );
      
      // Delete the offer
      await Offer.findByIdAndDelete(id);
      
      return true;
    },
    
    createReview: async (_, { input }) => {
      const { businessProfileId, authorId, ...reviewData } = input;
      
      // Check if business exists
      const business = await BusinessProfile.findById(businessProfileId);
      if (!business) {
        throw new Error('Business profile not found');
      }
      
      // Analyze sentiment using AI
      const { sentimentScore, sentimentAnalysis } = await analyzeReviewSentiment(reviewData.content);
      
      const review = new Review({
        ...reviewData,
        businessProfile: businessProfileId,
        author: authorId,
        sentimentScore,
        sentimentAnalysis
      });
      
      await review.save();
      
      // Update business profile to include this review and recalculate average rating
      await BusinessProfile.findByIdAndUpdate(
        businessProfileId,
        { 
          $push: { reviews: review.id }
        }
      );
      
      // Recalculate average rating
      const allReviews = await Review.find({ businessProfile: businessProfileId });
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / allReviews.length;
      
      await BusinessProfile.findByIdAndUpdate(
        businessProfileId,
        { averageRating: parseFloat(averageRating.toFixed(1)) }
      );
      
      return review;
    },
    
    respondToReview: async (_, { reviewId, response }) => {
      const review = await Review.findById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Add the response to the review
      review.responses.push(response);
      await review.save();
      
      return review;
    },
    
    deleteReview: async (_, { id }) => {
      const review = await Review.findById(id);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Remove the review from the business profile
      await BusinessProfile.findByIdAndUpdate(
        review.businessProfile,
        { $pull: { reviews: id } }
      );
      
      // Delete the review
      await Review.findByIdAndDelete(id);
      
      // Recalculate average rating
      const businessProfileId = review.businessProfile;
      const allReviews = await Review.find({ businessProfile: businessProfileId });
      
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        await BusinessProfile.findByIdAndUpdate(
          businessProfileId,
          { averageRating: parseFloat(averageRating.toFixed(1)) }
        );
      } else {
        // No reviews left, reset average rating to 0
        await BusinessProfile.findByIdAndUpdate(
          businessProfileId,
          { averageRating: 0 }
        );
      }
      
      return true;
    },
    
    // Event mutations
    createEvent: async (_, { input }) => {
      const { authorId, locationInput, locationId, ...eventData } = input;
      
      // Handle location (use existing ID or create a new one)
      let finalLocationId;
      
      if (locationId) {
        // Use the provided location ID
        const locationExists = await Location.findById(locationId);
        if (!locationExists) {
          throw new Error('Location not found');
        }
        finalLocationId = locationId;
      } else if (locationInput) {
        // Check if location already exists or create a new one
        const existingLocation = await Location.findOne({
          city: locationInput.city,
          postalCode: locationInput.postalCode,
          address: locationInput.address
        });
        
        if (existingLocation) {
          finalLocationId = existingLocation.id;
        } else {
          const newLocation = new Location({
            city: locationInput.city,
            postalCode: locationInput.postalCode,
            address: locationInput.address
          });
          await newLocation.save();
          finalLocationId = newLocation.id;
        }
      } else {
        throw new Error('Either locationId or locationInput must be provided');
      }
      
      // Convert date strings to Date objects
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);
      
      // Validate dates
      if (startDate > endDate) {
        throw new Error('Start date cannot be after end date');
      }
      
      const event = new Event({
        ...eventData,
        author: authorId,
        location: finalLocationId,
        startDate,
        endDate,
        participants: []
      });
      
      await event.save();
      return event;
    },
    
    updateEvent: async (_, { id, input }) => {
      // Convert dates if provided
      const updates = { ...input };
      
      if (updates.startDate) {
        updates.startDate = new Date(updates.startDate);
      }
      
      if (updates.endDate) {
        updates.endDate = new Date(updates.endDate);
      }
      
      // Validate dates if both are provided
      if (updates.startDate && updates.endDate && updates.startDate > updates.endDate) {
        throw new Error('Start date cannot be after end date');
      }
      
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );
      
      if (!updatedEvent) {
        throw new Error('Event not found');
      }
      
      return updatedEvent;
    },
    
    cancelEvent: async (_, { id }) => {
      const event = await Event.findByIdAndUpdate(
        id,
        { $set: { isCancelled: true } },
        { new: true }
      );
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      return event;
    },
    
    joinEvent: async (_, { eventId, residentId }) => {
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      if (event.isCancelled) {
        throw new Error('Cannot join a cancelled event');
      }
      
      // Check if the event has a maximum number of participants
      if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
        throw new Error('Event has reached maximum capacity');
      }
      
      // Check if resident is already a participant
      if (event.participants.includes(residentId)) {
        throw new Error('Resident is already a participant');
      }
      
      event.participants.push(residentId);
      await event.save();
      
      // Update resident's previous events
      // This would typically be handled by the Resident service
      // but for the sake of this implementation we'll assume it's handled elsewhere
      
      return event;
    },
    
    leaveEvent: async (_, { eventId, residentId }) => {
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Check if resident is a participant
      if (!event.participants.includes(residentId)) {
        throw new Error('Resident is not a participant of this event');
      }
      
      event.participants = event.participants.filter(id => id.toString() !== residentId);
      await event.save();
      
      return event;
    },
    
    // AI volunteer matching
    suggestVolunteersForEvent: async (_, { eventId }) => {
      const event = await Event.findById(eventId).populate('location');
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      try {
        // In a real implementation with a complete system:
        // 1. We would fetch all residents from the Resident service
        // 2. We would use AI to match them based on interests, location, and past behavior
        
        // Since we don't have direct access to Resident collection in this service,
        // we'll simulate this functionality
        
        // For demo purposes, assuming we have some test resident IDs
        // In a real implementation, we would fetch this from another service
        const simulatedResidents = [
          { 
            _id: "6001f1e5c2dc3e001b56b1a1", 
            interests: ["community", "volunteering", "environment"],
            location: event.location._id,
            previousEvents: ["5ff5e1a2c2dc3e001b56b001", "5ff5e1a2c2dc3e001b56b002"]
          },
          { 
            _id: "6001f1e5c2dc3e001b56b1a2", 
            interests: ["education", "technology", "networking"],
            location: "5ff5e1a2c2dc3e001b56c001", // Different location
            previousEvents: []
          },
          { 
            _id: "6001f1e5c2dc3e001b56b1a3", 
            interests: ["environment", "health", "sports"],
            location: event.location._id,
            previousEvents: ["5ff5e1a2c2dc3e001b56b003"]
          },
        ];
        
        // Use our AI matching service
        const suggestedVolunteerIds = await findVolunteersForEvent(event, simulatedResidents);
        
        // Update the event with suggested volunteers
        event.suggestedVolunteers = suggestedVolunteerIds;
        await event.save();
        
        // Return the suggested volunteers
        return event.suggestedVolunteers.map(id => ({ __typename: 'Resident', id }));
      } catch (error) {
        console.error("Error suggesting volunteers:", error);
        return [];
      }
    }
  }
};

module.exports = { resolvers };