const https = require('https');
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

const CREATE_RESIDENT = `
  mutation CreateResident($input: ResidentInput!) {
    createResident(input: $input) {
      id
      username
      role
    }
  }
`;

const CREATE_BUSINESS_OWNER = `
  mutation CreateBusinessOwner($input: BusinessOwnerInput!) {
    createBusinessOwner(input: $input) {
      id
      username
      role
    }
  }
`;

const CREATE_COMMUNITY_ORGANIZER = `
  mutation CreateCommunityOrganizer($input: CommunityOrganizerInput!) {
    createCommunityOrganizer(input: $input) {
      id
      username
      role
    }
  }
`;

async function createUsersViaAPI() {
    console.log('🚀 Creating demo users via GraphQL API...');

    const users = [
        // Residents
        {
            mutation: CREATE_RESIDENT,
            variables: {
                input: {
                    username: "john_doe",
                    password: "password123",
                    interests: ["gardening", "cooking", "volunteering"],
                    location: "Downtown"
                }
            },
            type: "Resident"
        },
        {
            mutation: CREATE_RESIDENT,
            variables: {
                input: {
                    username: "jane_smith", 
                    password: "password123",
                    interests: ["fitness", "reading", "community events"],
                    location: "Uptown"
                }
            },
            type: "Resident"
        },
        {
            mutation: CREATE_RESIDENT,
            variables: {
                input: {
                    username: "mike_wilson",
                    password: "password123", 
                    interests: ["technology", "sports", "music"],
                    location: "Downtown"
                }
            },
            type: "Resident"
        },
        // Business Owners
        {
            mutation: CREATE_BUSINESS_OWNER,
            variables: {
                input: {
                    username: "sarah_restaurant",
                    password: "password123"
                }
            },
            type: "Business Owner"
        },
        {
            mutation: CREATE_BUSINESS_OWNER,
            variables: {
                input: {
                    username: "tom_cafe",
                    password: "password123"
                }
            },
            type: "Business Owner"
        },
        {
            mutation: CREATE_BUSINESS_OWNER,
            variables: {
                input: {
                    username: "lisa_bakery",
                    password: "password123"
                }
            },
            type: "Business Owner"
        },
        // Community Organizer
        {
            mutation: CREATE_COMMUNITY_ORGANIZER,
            variables: {
                input: {
                    username: "admin_community",
                    password: "password123"
                }
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
                console.log(`❌ Error creating ${user.type} ${user.variables.input.username}:`, result.errors[0].message);
            } else {
                console.log(`✅ Created ${user.type}: ${user.variables.input.username}`);
            }
        } catch (error) {
            console.log(`❌ Error creating ${user.type} ${user.variables.input.username}:`, error.message);
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
    console.log('\n✨ Try logging in with any of these accounts!');
}

createUsersViaAPI();
