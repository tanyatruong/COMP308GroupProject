const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const { Resident } = require('./server/auth-service/models/Resident');
const { BusinessOwner } = require('./server/auth-service/models/BusinessOwner');
const { CommunityOrganizer } = require('./server/auth-service/models/CommunityOrganizer');
const { Location } = require('./server/auth-service/models/Location');

async function createWorkingDemoUsers() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create locations first
        console.log('📍 Creating locations...');
        const downtownLocation = new Location({
            city: "Downtown",
            postalCode: "10001",
            address: "123 Main Street, Downtown"
        });
        await downtownLocation.save();

        const uptownLocation = new Location({
            city: "Uptown",
            postalCode: "10002",
            address: "456 Oak Avenue, Uptown"
        });
        await uptownLocation.save();

        console.log('✅ Locations created');

        // Create demo users with proper password hashing
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
        console.log('✅ Created resident: john_doe');

        // Resident 2
        const resident2 = new Resident({
            role: "Resident", 
            username: "jane_smith",
            password: "password123",
            interests: ["fitness", "reading", "community events"],
            location: uptownLocation._id
        });
        await resident2.save();
        console.log('✅ Created resident: jane_smith');

        // Resident 3
        const resident3 = new Resident({
            role: "Resident",
            username: "mike_wilson", 
            password: "password123",
            interests: ["technology", "sports", "music"],
            location: downtownLocation._id
        });
        await resident3.save();
        console.log('✅ Created resident: mike_wilson');

        // Business Owner 1
        const businessOwner1 = new BusinessOwner({
            role: "BusinessOwner",
            username: "sarah_restaurant",
            password: "password123"
        });
        await businessOwner1.save();
        console.log('✅ Created business owner: sarah_restaurant');

        // Business Owner 2
        const businessOwner2 = new BusinessOwner({
            role: "BusinessOwner",
            username: "tom_cafe",
            password: "password123"
        });
        await businessOwner2.save();
        console.log('✅ Created business owner: tom_cafe');

        // Business Owner 3
        const businessOwner3 = new BusinessOwner({
            role: "BusinessOwner",
            username: "lisa_bakery",
            password: "password123"
        });
        await businessOwner3.save();
        console.log('✅ Created business owner: lisa_bakery');

        // Community Organizer
        const communityOrganizer = new CommunityOrganizer({
            role: "CommunityOrganizer",
            username: "admin_community",
            password: "password123"
        });
        await communityOrganizer.save();
        console.log('✅ Created community organizer: admin_community');

        console.log('\n🎉 All demo users created successfully!');
        console.log('\n📋 WORKING Demo Account Credentials:');
        console.log('=====================================');
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
        console.log('\n✨ These credentials are now in the database and will work!');

    } catch (error) {
        console.error('❌ Error creating demo users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

createWorkingDemoUsers();
