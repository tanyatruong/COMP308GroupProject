const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const { Resident } = require('./auth-service/models/Resident');
const { BusinessOwner } = require('./auth-service/models/BusinessOwner');
const { CommunityOrganizer } = require('./auth-service/models/CommunityOrganizer');
const { Location } = require('./auth-service/models/Location');

async function setupSimpleDemo() {
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
            Location.deleteMany({})
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

        // Community Organizer
        const communityOrganizer = new CommunityOrganizer({
            role: "CommunityOrganizer",
            username: "admin_community",
            password: "password123"
        });
        await communityOrganizer.save();

        console.log('✅ Demo users created');

        console.log('\n🎉 Simple demo data setup completed successfully!');
        console.log('\n📋 Demo Account Credentials:');
        console.log('================================');
        console.log('👤 RESIDENTS:');
        console.log('  • Username: john_doe     | Password: password123');
        console.log('  • Username: jane_smith   | Password: password123');
        console.log('\n🏢 BUSINESS OWNERS:');
        console.log('  • Username: sarah_restaurant | Password: password123');
        console.log('  • Username: tom_cafe          | Password: password123');
        console.log('\n👨‍💼 COMMUNITY ORGANIZER:');
        console.log('  • Username: admin_community   | Password: password123');
        console.log('\n🌐 Access URLs:');
        console.log('  • Main Portal: http://localhost:5173');
        console.log('  • Business App: http://localhost:3003');
        console.log('  • Auth App: http://localhost:3001');
        console.log('\n✨ All accounts have been created!');

    } catch (error) {
        console.error('❌ Error setting up demo data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

setupSimpleDemo();
