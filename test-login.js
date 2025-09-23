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

const LOGIN_MUTATION = `
  mutation Login($role: String!, $username: String!, $password: String!) {
    Login(role: $role, username: $username, password: $password) {
      ... on Resident {
        id
        username
        role
      }
      ... on BusinessOwner {
        id
        username
        role
      }
      ... on CommunityOrganizer {
        id
        username
        role
      }
    }
  }
`;

async function testLogin() {
    console.log('🧪 Testing login with john_doe...');

    try {
        const data = JSON.stringify({
            query: LOGIN_MUTATION,
            variables: {
                role: "Resident",
                username: "john_doe",
                password: "password123"
            }
        });

        const result = await makeRequest(GATEWAY_URL, data);
        
        if (result.errors) {
            console.log('❌ Login failed:', result.errors[0].message);
        } else {
            console.log('✅ Login successful:', result.data.Login);
        }
    } catch (error) {
        console.log('❌ Error testing login:', error.message);
    }
}

// Wait a moment for services to start
setTimeout(() => {
    testLogin();
}, 3000);
