const BusinessProfile = require('../models/BusinessProfile');
const Offer = require('../models/Offer');
const Review = require('../models/Review');
const { analyzeSentiment } = require('../utils/aiUtils');

const resolvers = {
  Query: {
    // Business Profile Queries
    getBusinessProfile: async (_, { id }) => {
      return await BusinessProfile.findById(id);
    },
    
    getBusinessProfilesByOwner: async (_, __, { user }) => {
      if (!user) throw new Error('You must be logged in');
      return await BusinessProfile.find({ businessOwner: user.id });
    },
    
    searchBusinesses: async (_, { query }) => {
      // Search by name, description, or tags
      return await BusinessProfile.find({
        $or: [
          { businessName: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { businessTags: { $in: [new RegExp(query, 'i')] } }
        ]
      });
    },
    
    getAllBusinessProfiles: async () => {
      return await BusinessProfile.find({});
    },
    
    // Offer Queries
    getOffer: async (_, { id }) => {
      return await Offer.findById(id).populate('business');
    },
    
    getOffersByBusiness: async (_, { businessId }) => {
      return await Offer.find({ business: businessId }).populate('business');
    },
    
    getAllOffers: async () => {
      return await Offer.find({}).populate('business');
    },
    
    // Review Queries
    getReview: async (_, { id }) => {
      return await Review.findById(id).populate('businessProfile');
    },
    
    getReviewsByBusiness: async (_, { businessId }) => {
      return await Review.find({ businessProfile: businessId }).populate('businessProfile');
    },
    
    getReviewsByAuthor: async (_, { authorId }) => {
      return await Review.find({ author: authorId }).populate('businessProfile');
    }
  },
  
  Mutation: {
    // Business Profile Mutations
    createBusinessProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Create new business profile
      const newBusinessProfile = new BusinessProfile({
        ...input,
        businessOwner: user.id
      });
      
      return await newBusinessProfile.save();
    },
    
    updateBusinessProfile: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if user owns the business profile
      const businessProfile = await BusinessProfile.findById(id);
      if (!businessProfile) throw new Error('Business profile not found');
      
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to update this business profile');
      }
      
      // Update the business profile
      return await BusinessProfile.findByIdAndUpdate(
        id,
        { ...input },
        { new: true }
      );
    },
    
    deleteBusinessProfile: async (_, { id }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if user owns the business profile
      const businessProfile = await BusinessProfile.findById(id);
      if (!businessProfile) throw new Error('Business profile not found');
      
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to delete this business profile');
      }
      
      // Delete all associated offers and reviews
      await Offer.deleteMany({ business: id });
      await Review.deleteMany({ businessProfile: id });
      
      // Delete the business profile
      const result = await BusinessProfile.findByIdAndDelete(id);
      return !!result;
    },
    
    // Offer Mutations
    createOffer: async (_, { input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if user owns the business
      const businessProfile = await BusinessProfile.findById(input.businessId);
      if (!businessProfile) throw new Error('Business profile not found');
      
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to create offers for this business');
      }
      
      // Create new offer
      const newOffer = new Offer({
        ...input,
        business: input.businessId
      });
      
      return await newOffer.save();
    },
    
    updateOffer: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if user owns the business
      const offer = await Offer.findById(id);
      if (!offer) throw new Error('Offer not found');
      
      const businessProfile = await BusinessProfile.findById(offer.business);
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to update offers for this business');
      }
      
      // Update the offer
      return await Offer.findByIdAndUpdate(
        id,
        { ...input, business: input.businessId || offer.business },
        { new: true }
      );
    },
    
    deleteOffer: async (_, { id }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if user owns the business
      const offer = await Offer.findById(id);
      if (!offer) throw new Error('Offer not found');
      
      const businessProfile = await BusinessProfile.findById(offer.business);
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to delete offers for this business');
      }
      
      // Delete the offer
      const result = await Offer.findByIdAndDelete(id);
      return !!result;
    },
    
    // Review Mutations
    createReview: async (_, { input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Check if the business exists
      const businessProfile = await BusinessProfile.findById(input.businessProfileId);
      if (!businessProfile) throw new Error('Business profile not found');
      
      // Prevent business owners from reviewing their own business
      if (businessProfile.businessOwner.toString() === user.id) {
        throw new Error('Cannot review your own business');
      }
      
      // Analyze sentiment with Gemini API
      const sentiment = await analyzeSentiment(input.content);
      
      // Create new review
      const newReview = new Review({
        businessProfile: input.businessProfileId,
        author: user.id,
        title: input.title,
        content: input.content,
        rating: input.rating,
        sentiment
      });
      
      const savedReview = await newReview.save();
      
      // Update business average rating
      const allReviews = await Review.find({ businessProfile: input.businessProfileId });
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / allReviews.length;
      
      await BusinessProfile.findByIdAndUpdate(
        input.businessProfileId,
        { averageRating: parseFloat(averageRating.toFixed(1)) }
      );
      
      return savedReview;
    },
    
    respondToReview: async (_, { input }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Find the review
      const review = await Review.findById(input.reviewId);
      if (!review) throw new Error('Review not found');
      
      // Check if user owns the business
      const businessProfile = await BusinessProfile.findById(review.businessProfile);
      if (businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to respond to this review');
      }
      
      // Add response to the review
      review.responses.push({
        content: input.content,
        responseDate: new Date()
      });
      
      return await review.save();
    },
    
    deleteReview: async (_, { id }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      
      // Find the review
      const review = await Review.findById(id);
      if (!review) throw new Error('Review not found');
      
      // Check if user is the author or the business owner
      const businessProfile = await BusinessProfile.findById(review.businessProfile);
      
      if (review.author.toString() !== user.id && 
          businessProfile.businessOwner.toString() !== user.id) {
        throw new Error('Not authorized to delete this review');
      }
      
      // Delete the review
      const result = await Review.findByIdAndDelete(id);
      
      // Update business average rating
      if (result) {
        const allReviews = await Review.find({ businessProfile: review.businessProfile });
        
        if (allReviews.length > 0) {
          const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRating / allReviews.length;
          
          await BusinessProfile.findByIdAndUpdate(
            review.businessProfile,
            { averageRating: parseFloat(averageRating.toFixed(1)) }
          );
        } else {
          await BusinessProfile.findByIdAndUpdate(
            review.businessProfile,
            { averageRating: 0 }
          );
        }
      }
      
      return !!result;
    }
  }
};

module.exports = resolvers;