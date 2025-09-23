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
  mutation ResSignup($role: String!, $username: String!, $password: String!, $interests: [String!]!, $location: LocationInput!) {
    resSignup(role: $role, username: $username, password: $password, interests: $interests, location: $location) {
      id
      username
      role
    }
  }
`;

async function createResidents() {
    console.log('🚀 Creating residents with correct types...');

    const residents = [
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
        }
    ];

    for (const resident of residents) {
        try {
            const data = JSON.stringify({
                query: resident.mutation,
                variables: resident.variables
            });

            const result = await makeRequest(GATEWAY_URL, data);
            
            if (result.errors) {
                console.log(`❌ Error creating ${resident.type} ${resident.variables.username}:`, result.errors[0].message);
            } else {
                console.log(`✅ Created ${resident.type}: ${resident.variables.username}`);
            }
        } catch (error) {
            console.log(`❌ Error creating ${resident.type} ${resident.variables.username}:`, error.message);
        }
    }

    console.log('\n🎉 Resident creation completed!');
}

createResidents();
