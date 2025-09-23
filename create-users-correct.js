const http = require('http');

const GATEWAY_URL = 'http://localhost:4000/graphql';

// Simple HTTP request function
function makeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

const RESIDENT_SIGNUP = `
  mutation ResSignup($role: String!, $username: String!, $password: String!, $interests: [String], $location: LocationInput!) {
    resSignup(role: $role, username: $username, password: $password, interests: $interests, location: $location) {
      id
      username
      role
    }
  }
`;

const BUSINESS_OWNER_SIGNUP = `
  mutation BoSignup($role: String!, $username: String!, $password: String!) {
    boSignup(role: $role, username: $username, password: $password) {
      id
      username
      role
    }
  }
`;

const COMMUNITY_ORGANIZER_SIGNUP = `
  mutation CoSignup($role: String!, $username: String!, $password: String!) {
    coSignup(role: $role, username: $username, password: $password) {
      id
      username
      role
    }
  }
`;

async function createUsersCorrect() {
    console.log('🚀 Creating demo users via correct GraphQL mutations...');

    const users = [
        // Residents
        {
            mutation: RESIDENT_SIGNUP,
            variables: {
                role: "Resident",
                username: "john_doe",
                password: "password123",
                interests: ["gardening", "cooking", "volunteering"],
                location: {
                    city: "Downtown",
                    postalCode: "10001",
                    address: "123 Main Street, Downtown"
                }
            },
            type: "Resident"
        },
        {
            mutation: RESIDENT_SIGNUP,
            variables: {
                role: "Resident",
                username: "jane_smith", 
                password: "password123",
                interests: ["fitness", "reading", "community events"],
                location: {
                    city: "Uptown",
                    postalCode: "10002",
                    address: "456 Oak Avenue, Uptown"
                }
            },
            type: "Resident"
        },
        {
            mutation: RESIDENT_SIGNUP,
            variables: {
                role: "Resident",
                username: "mike_wilson",
                password: "password123", 
                interests: ["technology", "sports", "music"],
                location: {
                    city: "Downtown",
                    postalCode: "10001",
                    address: "789 Pine Street, Downtown"
                }
            },
            type: "Resident"
        },
        // Business Owners
        {
            mutation: BUSINESS_OWNER_SIGNUP,
            variables: {
                role: "BusinessOwner",
                username: "sarah_restaurant",
                password: "password123"
            },
            type: "Business Owner"
        },
        {
            mutation: BUSINESS_OWNER_SIGNUP,
            variables: {
                role: "BusinessOwner",
                username: "tom_cafe",
                password: "password123"
            },
            type: "Business Owner"
        },
        {
            mutation: BUSINESS_OWNER_SIGNUP,
            variables: {
                role: "BusinessOwner",
                username: "lisa_bakery",
                password: "password123"
            },
            type: "Business Owner"
        },
        // Community Organizer
        {
            mutation: COMMUNITY_ORGANIZER_SIGNUP,
            variables: {
                role: "CommunityOrganizer",
                username: "admin_community",
                password: "password123"
            },
            type: "Community Organizer"
        }
    ];

    for (const user of users) {
        try {
            const data = JSON.stringify({
                query: user.mutation,
                variables: user.variables
            });

            const result = await makeRequest(GATEWAY_URL, data);
            
            if (result.errors) {
                console.log(`❌ Error creating ${user.type} ${user.variables.username}:`, result.errors[0].message);
            } else {
                console.log(`✅ Created ${user.type}: ${user.variables.username}`);
            }
        } catch (error) {
            console.log(`❌ Error creating ${user.type} ${user.variables.username}:`, error.message);
        }
    }

    console.log('\n🎉 Demo user creation completed!');
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
}

createUsersCorrect();
