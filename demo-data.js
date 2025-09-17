const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGO_URI = "mongodb+srv://ttruong2811_db_user:QtOWE6rQXdM8eE5Q@clustercommunityhub.n3he34v.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCommunityHub";

// Connect to MongoDB
mongoose.connect(MONGO_URI);

// Define schemas
const locationSchema = new mongoose.Schema({
  city: String,
  postalCode: String,
  address: String
});

const residentSchema = new mongoose.Schema({
  role: { type: String, default: 'Resident' },
  username: String,
  password: String,
  interests: [String],
  location: locationSchema,
  previousEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

const businessOwnerSchema = new mongoose.Schema({
  role: { type: String, default: 'BusinessOwner' },
  username: String,
  password: String
});

const communityOrganizerSchema = new mongoose.Schema({
  role: { type: String, default: 'CommunityOrganizer' },
  username: String,
  password: String
});

const businessProfileSchema = new mongoose.Schema({
  businessName: String,
  businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner' },
  location: locationSchema,
  description: String,
  images: [String],
  businessTags: [String],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const offerSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile' },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  businessProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  title: String,
  content: String,
  rating: { type: Number, min: 1, max: 5 },
  sentimentScore: Number,
  sentimentAnalysis: String,
  responses: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityOrganizer' },
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: locationSchema,
  tags: [String],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }],
  maxParticipants: Number,
  isCancelled: { type: Boolean, default: false },
  suggestedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const Resident = mongoose.model('Resident', residentSchema);
const BusinessOwner = mongoose.model('BusinessOwner', businessOwnerSchema);
const CommunityOrganizer = mongoose.model('CommunityOrganizer', communityOrganizerSchema);
const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);
const Offer = mongoose.model('Offer', offerSchema);
const Review = mongoose.model('Review', reviewSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Event = mongoose.model('Event', eventSchema);
const Location = mongoose.model('Location', locationSchema);

// Demo data
const demoData = async () => {
  try {
    // Wait for connection
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('open', resolve);
      }
    });
    
    console.log('🗑️ Clearing existing data...');
    await mongoose.connection.db.dropDatabase();
    
    console.log('👥 Creating demo users...');
    
    // Create locations
    const locations = await Location.insertMany([
      { city: 'Toronto', postalCode: 'M5V 3A8', address: '123 King Street West' },
      { city: 'Toronto', postalCode: 'M5H 2N2', address: '456 Bay Street' },
      { city: 'Toronto', postalCode: 'M5B 2H1', address: '789 Yonge Street' },
      { city: 'Toronto', postalCode: 'M4Y 1W5', address: '321 Bloor Street East' },
      { city: 'Toronto', postalCode: 'M6G 1A1', address: '654 College Street' }
    ]);

    // Create residents
    const residents = await Resident.insertMany([
      {
        username: 'sarah_johnson',
        password: await bcrypt.hash('password123', 10),
        interests: ['community events', 'volunteering', 'local businesses'],
        location: locations[0]
      },
      {
        username: 'mike_chen',
        password: await bcrypt.hash('password123', 10),
        interests: ['technology', 'networking', 'food'],
        location: locations[1]
      },
      {
        username: 'emma_wilson',
        password: await bcrypt.hash('password123', 10),
        interests: ['art', 'culture', 'community service'],
        location: locations[2]
      },
      {
        username: 'david_brown',
        password: await bcrypt.hash('password123', 10),
        interests: ['sports', 'fitness', 'outdoor activities'],
        location: locations[3]
      },
      {
        username: 'lisa_garcia',
        password: await bcrypt.hash('password123', 10),
        interests: ['education', 'children', 'family events'],
        location: locations[4]
      }
    ]);

    // Create business owners
    const businessOwners = await BusinessOwner.insertMany([
      { username: 'tony_restaurant', password: await bcrypt.hash('password123', 10) },
      { username: 'maria_cafe', password: await bcrypt.hash('password123', 10) },
      { username: 'john_gym', password: await bcrypt.hash('password123', 10) },
      { username: 'sophie_salon', password: await bcrypt.hash('password123', 10) },
      { username: 'alex_tech', password: await bcrypt.hash('password123', 10) }
    ]);

    // Create community organizer
    const communityOrganizer = await CommunityOrganizer.create({
      username: 'community_admin',
      password: await bcrypt.hash('password123', 10)
    });

    console.log('🏢 Creating business profiles...');
    
    // Create business profiles
    const businessProfiles = await BusinessProfile.insertMany([
      {
        businessName: 'Tony\'s Italian Bistro',
        businessOwner: businessOwners[0]._id,
        location: locations[0],
        description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations. Family-owned since 1985.',
        images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'],
        businessTags: ['restaurant', 'italian', 'family-friendly', 'fine-dining'],
        averageRating: 4.5
      },
      {
        businessName: 'Maria\'s Coffee Corner',
        businessOwner: businessOwners[1]._id,
        location: locations[1],
        description: 'Cozy neighborhood coffee shop serving artisanal coffee, fresh pastries, and light meals. Perfect for remote work or casual meetings.',
        images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500'],
        businessTags: ['coffee', 'cafe', 'pastries', 'wifi', 'remote-work'],
        averageRating: 4.2
      },
      {
        businessName: 'FitLife Gym & Wellness',
        businessOwner: businessOwners[2]._id,
        location: locations[2],
        description: 'State-of-the-art fitness facility with personal training, group classes, and wellness programs. Open 24/7 for your convenience.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'],
        businessTags: ['gym', 'fitness', 'personal-training', 'group-classes', 'wellness'],
        averageRating: 4.7
      },
      {
        businessName: 'Sophie\'s Beauty Studio',
        businessOwner: businessOwners[3]._id,
        location: locations[3],
        description: 'Full-service beauty salon offering haircuts, coloring, styling, manicures, pedicures, and spa treatments. Licensed professionals.',
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'],
        businessTags: ['salon', 'beauty', 'hair', 'nails', 'spa', 'styling'],
        averageRating: 4.3
      },
      {
        businessName: 'TechFix Computer Repair',
        businessOwner: businessOwners[4]._id,
        location: locations[4],
        description: 'Professional computer repair services for laptops, desktops, and mobile devices. Data recovery, virus removal, and hardware upgrades.',
        images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500'],
        businessTags: ['computer-repair', 'tech-support', 'data-recovery', 'hardware', 'software'],
        averageRating: 4.6
      }
    ]);

    console.log('💡 Creating offers...');
    
    // Create offers
    const offers = await Offer.insertMany([
      {
        title: '20% Off All Pasta Dishes',
        content: 'Enjoy our signature pasta dishes with 20% off every Tuesday and Wednesday. Valid for dine-in only. Fresh ingredients, authentic recipes!',
        business: businessProfiles[0]._id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true
      },
      {
        title: 'Free Pastry with Coffee Purchase',
        content: 'Get a free croissant or muffin with any large coffee purchase. Available all day, every day. Perfect for your morning routine!',
        business: businessProfiles[1]._id,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isActive: true
      },
      {
        title: 'New Member Special - 50% Off First Month',
        content: 'Join FitLife Gym and get 50% off your first month membership. Includes access to all equipment, group classes, and locker room facilities.',
        business: businessProfiles[2]._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true
      },
      {
        title: 'Hair Cut & Style Package - $45',
        content: 'Complete hair makeover including wash, cut, and style for just $45. Regular price $65. Book your appointment today!',
        business: businessProfiles[3]._id,
        expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        isActive: true
      },
      {
        title: 'Free Diagnostic for Computer Issues',
        content: 'Bring in your computer for a free diagnostic check. We\'ll identify the problem and provide a detailed repair estimate. No obligation!',
        business: businessProfiles[4]._id,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isActive: true
      }
    ]);

    console.log('⭐ Creating reviews...');
    
    // Create reviews
    const reviews = await Review.insertMany([
      {
        businessProfile: businessProfiles[0]._id,
        author: residents[0]._id,
        title: 'Amazing Italian Food!',
        content: 'The pasta was absolutely delicious and the service was excellent. The atmosphere is cozy and perfect for a date night. Will definitely come back!',
        rating: 5,
        sentimentScore: 0.9,
        sentimentAnalysis: 'Very positive review highlighting food quality, service, and atmosphere.',
        responses: ['Thank you so much for your wonderful review! We\'re thrilled you enjoyed your experience.']
      },
      {
        businessProfile: businessProfiles[0]._id,
        author: residents[1]._id,
        title: 'Good food, slow service',
        content: 'The food was tasty but the service was quite slow. Had to wait 45 minutes for our main course. Food quality made up for it though.',
        rating: 3,
        sentimentScore: 0.4,
        sentimentAnalysis: 'Mixed review with positive food comments but negative service experience.',
        responses: ['We apologize for the slow service. We\'re working on improving our kitchen efficiency. Thank you for the feedback!']
      },
      {
        businessProfile: businessProfiles[1]._id,
        author: residents[2]._id,
        title: 'Perfect coffee spot!',
        content: 'Great coffee, friendly staff, and excellent WiFi. Perfect place to work remotely. The pastries are fresh and delicious too.',
        rating: 5,
        sentimentScore: 0.95,
        sentimentAnalysis: 'Highly positive review praising multiple aspects of the business.',
        responses: []
      },
      {
        businessProfile: businessProfiles[2]._id,
        author: residents[3]._id,
        title: 'Best gym in the area',
        content: 'Clean facilities, modern equipment, and helpful staff. The personal trainers are knowledgeable and the group classes are fun. Highly recommend!',
        rating: 5,
        sentimentScore: 0.9,
        sentimentAnalysis: 'Very positive review highlighting multiple positive aspects.',
        responses: ['Thank you for the great review! We\'re glad you\'re enjoying your fitness journey with us.']
      },
      {
        businessProfile: businessProfiles[3]._id,
        author: residents[4]._id,
        title: 'Great haircut!',
        content: 'Sophie did an amazing job with my haircut. She listened to what I wanted and delivered exactly that. The salon is clean and professional.',
        rating: 4,
        sentimentScore: 0.8,
        sentimentAnalysis: 'Positive review with specific praise for the stylist and environment.',
        responses: []
      }
    ]);

    console.log('📝 Creating community posts...');
    
    // Create community posts
    const posts = await Post.insertMany([
      {
        title: 'Community Cleanup Day - This Saturday!',
        content: 'Join us this Saturday at 9 AM for our monthly community cleanup. We\'ll meet at the park entrance and provide all necessary supplies. Let\'s keep our neighborhood beautiful!',
        author: residents[0]._id
      },
      {
        title: 'Lost Dog - Please Help!',
        content: 'Our golden retriever Max went missing yesterday near the intersection of King and Bay. He\'s wearing a blue collar and is very friendly. If you see him, please call 416-555-0123. Reward offered!',
        author: residents[1]._id
      },
      {
        title: 'New Art Gallery Opening',
        content: 'Exciting news! A new art gallery is opening on College Street next month. They\'ll feature local artists and have free admission on weekends. Great addition to our community!',
        author: residents[2]._id
      },
      {
        title: 'Block Party Planning Meeting',
        content: 'We\'re organizing a summer block party for our street. Meeting this Thursday at 7 PM at my house (456 Bay Street). Bring your ideas and let\'s make it amazing!',
        author: residents[3]._id
      },
      {
        title: 'Free Computer Help Available',
        content: 'I\'m offering free basic computer help to anyone in the community. Whether it\'s setting up email, using social media, or basic troubleshooting. Just send me a message!',
        author: residents[4]._id
      }
    ]);

    console.log('💬 Creating comments...');
    
    // Create comments
    const comments = await Comment.insertMany([
      {
        text: 'I\'ll be there! What should I bring?',
        author: residents[1]._id,
        postId: posts[0]._id
      },
      {
        text: 'Great initiative! I\'ll spread the word to my neighbors.',
        author: residents[2]._id,
        postId: posts[0]._id
      },
      {
        text: 'I saw a golden retriever near the park yesterday. Was it around 3 PM?',
        author: residents[3]._id,
        postId: posts[1]._id
      },
      {
        text: 'Yes, that could be him! Can you call me at the number I provided?',
        author: residents[1]._id,
        postId: posts[1]._id
      },
      {
        text: 'This is fantastic! I\'m an artist and would love to participate.',
        author: residents[4]._id,
        postId: posts[2]._id
      }
    ]);

    console.log('🎉 Creating community events...');
    
    // Create events
    const events = await Event.insertMany([
      {
        author: communityOrganizer._id,
        title: 'Summer Music Festival',
        description: 'Join us for our annual summer music festival featuring local bands, food trucks, and family activities. Free admission for all residents!',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: locations[0],
        tags: ['music', 'festival', 'family', 'free', 'summer'],
        participants: [residents[0]._id, residents[1]._id, residents[2]._id],
        maxParticipants: 200
      },
      {
        author: communityOrganizer._id,
        title: 'Tech Workshop for Seniors',
        description: 'Learn basic computer skills, internet safety, and how to use smartphones and tablets. Perfect for seniors who want to stay connected.',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: locations[1],
        tags: ['technology', 'education', 'seniors', 'workshop'],
        participants: [residents[4]._id],
        maxParticipants: 20
      },
      {
        author: communityOrganizer._id,
        title: 'Neighborhood Yard Sale',
        description: 'Annual neighborhood yard sale! Clean out your closets and find great deals. Maps will be available at the community center.',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        location: locations[2],
        tags: ['yard-sale', 'community', 'shopping', 'family'],
        participants: [residents[0]._id, residents[3]._id],
        maxParticipants: 50
      }
    ]);

    // Update business profiles with reviews
    for (let i = 0; i < businessProfiles.length; i++) {
      const businessReviews = reviews.filter(review => review.businessProfile.toString() === businessProfiles[i]._id.toString());
      const avgRating = businessReviews.length > 0 ? 
        businessReviews.reduce((sum, review) => sum + review.rating, 0) / businessReviews.length : 0;
      
      await BusinessProfile.findByIdAndUpdate(businessProfiles[i]._id, {
        averageRating: avgRating
      });
    }

    console.log('✅ Demo data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Residents: ${residents.length}`);
    console.log(`🏢 Business Owners: ${businessOwners.length}`);
    console.log(`👨‍💼 Community Organizer: 1`);
    console.log(`🏪 Business Profiles: ${businessProfiles.length}`);
    console.log(`💡 Offers: ${offers.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📝 Posts: ${posts.length}`);
    console.log(`💬 Comments: ${comments.length}`);
    console.log(`🎉 Events: ${events.length}`);
    
    console.log('\n🔑 Demo Account Credentials:');
    console.log('All passwords are: password123');
    console.log('\nResidents:');
    residents.forEach((resident, i) => console.log(`  ${i + 1}. ${resident.username}`));
    console.log('\nBusiness Owners:');
    businessOwners.forEach((owner, i) => console.log(`  ${i + 1}. ${owner.username}`));
    console.log('\nCommunity Organizer:');
    console.log(`  1. ${communityOrganizer.username}`);
    
    console.log('\n🌐 Access your applications:');
    console.log('Business Dashboard: http://localhost:3003');
    console.log('Resident Hub: http://localhost:5173');
    console.log('GraphQL Playground: http://localhost:4000/graphql');
    
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the demo data creation
demoData();
