const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const { Resident } = require('./auth-service/models/Resident');
const { BusinessOwner } = require('./auth-service/models/BusinessOwner');
const { CommunityOrganizer } = require('./auth-service/models/CommunityOrganizer');
const { Location } = require('./auth-service/models/Location');

// Business models
const { BusinessProfile } = require('./business-events-service/models/BusinessProfile');
const { Offer } = require('./business-events-service/models/Offer');
const { Event } = require('./business-events-service/models/Event');
const { Review } = require('./business-events-service/models/Review');

// Community models
const { Post } = require('./community-service/models/Post');
const { Comment } = require('./community-service/models/Comment');
const { HelpRequestPost } = require('./community-service/models/neighbourhoodHelpRequests/HelpRequestPost.model.server');
const { HelpRequestComment } = require('./community-service/models/neighbourhoodHelpRequests/HelpRequestComment.model.server');

async function setupDemoData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Resident.deleteMany({}),
            BusinessOwner.deleteMany({}),
            CommunityOrganizer.deleteMany({}),
            Location.deleteMany({}),
            BusinessProfile.deleteMany({}),
            Offer.deleteMany({}),
            Event.deleteMany({}),
            Review.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            HelpRequestPost.deleteMany({}),
            HelpRequestComment.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Create locations
        console.log('📍 Creating locations...');
        const downtownLocation = new Location({
            name: "Downtown",
            address: "123 Main Street, Downtown",
            coordinates: { lat: 40.7128, lng: -74.0060 }
        });
        await downtownLocation.save();

        const uptownLocation = new Location({
            name: "Uptown",
            address: "456 Oak Avenue, Uptown", 
            coordinates: { lat: 40.7589, lng: -73.9851 }
        });
        await uptownLocation.save();

        const midtownLocation = new Location({
            name: "Midtown",
            address: "789 Pine Street, Midtown",
            coordinates: { lat: 40.7505, lng: -73.9934 }
        });
        await midtownLocation.save();

        // Create demo users
        console.log('👥 Creating demo users...');

        // Resident 1
        const resident1 = new Resident({
            role: "Resident",
            username: "john_doe",
            password: "password123",
            interests: ["gardening", "cooking", "volunteering"],
            location: downtownLocation._id
        });
        await resident1.save();

        // Resident 2
        const resident2 = new Resident({
            role: "Resident", 
            username: "jane_smith",
            password: "password123",
            interests: ["fitness", "reading", "community events"],
            location: uptownLocation._id
        });
        await resident2.save();

        // Resident 3
        const resident3 = new Resident({
            role: "Resident",
            username: "mike_wilson", 
            password: "password123",
            interests: ["technology", "sports", "music"],
            location: midtownLocation._id
        });
        await resident3.save();

        // Business Owner 1
        const businessOwner1 = new BusinessOwner({
            role: "BusinessOwner",
            username: "sarah_restaurant",
            password: "password123"
        });
        await businessOwner1.save();

        // Business Owner 2
        const businessOwner2 = new BusinessOwner({
            role: "BusinessOwner",
            username: "tom_cafe",
            password: "password123"
        });
        await businessOwner2.save();

        // Business Owner 3
        const businessOwner3 = new BusinessOwner({
            role: "BusinessOwner",
            username: "lisa_bakery",
            password: "password123"
        });
        await businessOwner3.save();

        // Community Organizer
        const communityOrganizer = new CommunityOrganizer({
            role: "CommunityOrganizer",
            username: "admin_community",
            password: "password123"
        });
        await communityOrganizer.save();

        console.log('✅ Demo users created');

        // Create business profiles
        console.log('🏢 Creating business profiles...');

        const restaurantProfile = new BusinessProfile({
            businessOwnerId: businessOwner1._id,
            businessName: "Sarah's Italian Bistro",
            description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
            category: "Restaurant",
            location: downtownLocation._id,
            contactInfo: {
                phone: "(555) 123-4567",
                email: "info@sarahsitalian.com",
                website: "www.sarahsitalian.com"
            },
            hours: {
                monday: "11:00 AM - 10:00 PM",
                tuesday: "11:00 AM - 10:00 PM", 
                wednesday: "11:00 AM - 10:00 PM",
                thursday: "11:00 AM - 10:00 PM",
                friday: "11:00 AM - 11:00 PM",
                saturday: "10:00 AM - 11:00 PM",
                sunday: "10:00 AM - 9:00 PM"
            },
            amenities: ["WiFi", "Outdoor Seating", "Takeout", "Delivery"],
            isActive: true
        });
        await restaurantProfile.save();

        const cafeProfile = new BusinessProfile({
            businessOwnerId: businessOwner2._id,
            businessName: "Tom's Coffee Corner",
            description: "Cozy coffee shop with locally roasted beans and homemade pastries",
            category: "Cafe",
            location: uptownLocation._id,
            contactInfo: {
                phone: "(555) 234-5678",
                email: "hello@tomscoffee.com",
                website: "www.tomscoffee.com"
            },
            hours: {
                monday: "6:00 AM - 8:00 PM",
                tuesday: "6:00 AM - 8:00 PM",
                wednesday: "6:00 AM - 8:00 PM", 
                thursday: "6:00 AM - 8:00 PM",
                friday: "6:00 AM - 9:00 PM",
                saturday: "7:00 AM - 9:00 PM",
                sunday: "7:00 AM - 7:00 PM"
            },
            amenities: ["WiFi", "Pet Friendly", "Free Parking", "Live Music"],
            isActive: true
        });
        await cafeProfile.save();

        const bakeryProfile = new BusinessProfile({
            businessOwnerId: businessOwner3._id,
            businessName: "Lisa's Artisan Bakery",
            description: "Fresh baked goods made daily with organic ingredients",
            category: "Bakery",
            location: midtownLocation._id,
            contactInfo: {
                phone: "(555) 345-6789",
                email: "orders@lisasbakery.com",
                website: "www.lisasbakery.com"
            },
            hours: {
                monday: "6:00 AM - 6:00 PM",
                tuesday: "6:00 AM - 6:00 PM",
                wednesday: "6:00 AM - 6:00 PM",
                thursday: "6:00 AM - 6:00 PM", 
                friday: "6:00 AM - 7:00 PM",
                saturday: "7:00 AM - 7:00 PM",
                sunday: "8:00 AM - 5:00 PM"
            },
            amenities: ["Custom Orders", "Catering", "Gluten-Free Options", "Online Ordering"],
            isActive: true
        });
        await bakeryProfile.save();

        console.log('✅ Business profiles created');

        // Create offers
        console.log('🎯 Creating offers...');

        const offer1 = new Offer({
            businessProfileId: restaurantProfile._id,
            title: "Weekend Special - 20% Off Pasta",
            description: "Get 20% off all pasta dishes every weekend!",
            discountPercentage: 20,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            isActive: true
        });
        await offer1.save();

        const offer2 = new Offer({
            businessProfileId: cafeProfile._id,
            title: "Happy Hour - 50% Off Pastries",
            description: "Half price on all pastries from 3-5 PM weekdays",
            discountPercentage: 50,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            isActive: true
        });
        await offer2.save();

        const offer3 = new Offer({
            businessProfileId: bakeryProfile._id,
            title: "Birthday Cake Special",
            description: "Free delivery on birthday cakes over $50",
            discountPercentage: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            isActive: true
        });
        await offer3.save();

        console.log('✅ Offers created');

        // Create events
        console.log('📅 Creating events...');

        const event1 = new Event({
            title: "Community Garden Workshop",
            description: "Learn about sustainable gardening and composting techniques",
            location: downtownLocation._id,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            time: "10:00 AM",
            maxParticipants: 25,
            currentParticipants: 0,
            organizerId: communityOrganizer._id,
            category: "Education",
            isActive: true
        });
        await event1.save();

        const event2 = new Event({
            title: "Neighborhood Cleanup Day",
            description: "Join us for a community cleanup of the local park",
            location: uptownLocation._id,
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            time: "9:00 AM",
            maxParticipants: 50,
            currentParticipants: 0,
            organizerId: communityOrganizer._id,
            category: "Volunteer",
            isActive: true
        });
        await event2.save();

        const event3 = new Event({
            title: "Local Business Networking Mixer",
            description: "Connect with other local business owners and entrepreneurs",
            location: midtownLocation._id,
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
            time: "6:00 PM",
            maxParticipants: 30,
            currentParticipants: 0,
            organizerId: communityOrganizer._id,
            category: "Networking",
            isActive: true
        });
        await event3.save();

        console.log('✅ Events created');

        // Create reviews
        console.log('⭐ Creating reviews...');

        const review1 = new Review({
            businessProfileId: restaurantProfile._id,
            reviewerId: resident1._id,
            rating: 5,
            comment: "Amazing pasta! The atmosphere is cozy and the service is excellent.",
            isVerified: true
        });
        await review1.save();

        const review2 = new Review({
            businessProfileId: cafeProfile._id,
            reviewerId: resident2._id,
            rating: 4,
            comment: "Great coffee and friendly staff. Perfect place to work remotely.",
            isVerified: true
        });
        await review2.save();

        const review3 = new Review({
            businessProfileId: bakeryProfile._id,
            reviewerId: resident3._id,
            rating: 5,
            comment: "Best croissants in town! Fresh and delicious every time.",
            isVerified: true
        });
        await review3.save();

        console.log('✅ Reviews created');

        // Create community posts
        console.log('📝 Creating community posts...');

        const post1 = new Post({
            authorId: resident1._id,
            title: "Looking for Gardening Tips",
            content: "I'm new to gardening and would love some advice on growing tomatoes. Any experienced gardeners willing to share tips?",
            category: "General",
            location: downtownLocation._id,
            isActive: true
        });
        await post1.save();

        const post2 = new Post({
            authorId: resident2._id,
            title: "Book Club Meeting This Friday",
            content: "Join us this Friday at 7 PM at the community center for our monthly book club discussion. This month we're reading 'The Great Gatsby'.",
            category: "Events",
            location: uptownLocation._id,
            isActive: true
        });
        await post2.save();

        const post3 = new Post({
            authorId: communityOrganizer._id,
            title: "New Community Center Hours",
            content: "Starting next week, the community center will be open until 9 PM on weekdays. We've also added new fitness classes!",
            category: "Announcements",
            location: midtownLocation._id,
            isActive: true
        });
        await post3.save();

        console.log('✅ Community posts created');

        // Create help requests
        console.log('🆘 Creating help requests...');

        const helpRequest1 = new HelpRequestPost({
            authorId: resident1._id,
            title: "Need Help Moving Furniture",
            content: "I need help moving a heavy dresser to the second floor. Willing to pay $50 for assistance.",
            category: "Physical Help",
            location: downtownLocation._id,
            urgency: "Medium",
            isActive: true
        });
        await helpRequest1.save();

        const helpRequest2 = new HelpRequestPost({
            authorId: resident2._id,
            title: "Tutoring Needed - Math",
            content: "My daughter needs help with algebra homework. Looking for someone who can tutor her for 2 hours a week.",
            category: "Education",
            location: uptownLocation._id,
            urgency: "Low",
            isActive: true
        });
        await helpRequest2.save();

        const helpRequest3 = new HelpRequestPost({
            authorId: resident3._id,
            title: "Pet Sitting for Weekend",
            content: "Going out of town this weekend and need someone to check on my cat. Will provide food and instructions.",
            category: "Pet Care",
            location: midtownLocation._id,
            urgency: "High",
            isActive: true
        });
        await helpRequest3.save();

        console.log('✅ Help requests created');

        console.log('\n🎉 Demo data setup completed successfully!');
        console.log('\n📋 Demo Account Credentials:');
        console.log('================================');
        console.log('👤 RESIDENTS:');
        console.log('  • Username: john_doe     | Password: password123');
        console.log('  • Username: jane_smith   | Password: password123');
        console.log('  • Username: mike_wilson  | Password: password123');
        console.log('\n🏢 BUSINESS OWNERS:');
        console.log('  • Username: sarah_restaurant | Password: password123');
        console.log('  • Username: tom_cafe          | Password: password123');
        console.log('  • Username: lisa_bakery       | Password: password123');
        console.log('\n👨‍💼 COMMUNITY ORGANIZER:');
        console.log('  • Username: admin_community   | Password: password123');
        console.log('\n🌐 Access URLs:');
        console.log('  • Main Portal: http://localhost:5173');
        console.log('  • Business App: http://localhost:3003');
        console.log('  • Auth App: http://localhost:3001');
        console.log('\n✨ All accounts have been created with sample data!');

    } catch (error) {
        console.error('❌ Error setting up demo data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

setupDemoData();
