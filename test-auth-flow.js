const http = require('http');
const https = require('https');

// Test the complete authentication flow
async function testAuthFlow() {
    console.log('🧪 Testing complete authentication flow...\n');

    // Step 1: Login
    console.log('1️⃣ Logging in as john_doe...');
    const loginData = JSON.stringify({
        query: `
            mutation Login($role: String!, $username: String!, $password: String!) {
                Login(role: $role, username: $username, password: $password) {
                    ... on Resident {
                        id
                        username
                        role
                    }
                }
            }
        `,
        variables: {
            role: "Resident",
            username: "john_doe",
            password: "password123"
        }
    });

    const loginResponse = await makeRequest('http://localhost:4000/graphql', loginData);
    
    if (loginResponse.errors) {
        console.log('❌ Login failed:', loginResponse.errors[0].message);
        return;
    }
    
    console.log('✅ Login successful:', loginResponse.data.Login);
    
    // Extract cookies from login response
    const setCookieHeader = loginResponse.headers?.['set-cookie'];
    if (!setCookieHeader) {
        console.log('❌ No cookies set in login response');
        return;
    }
    
    console.log('🍪 Cookies set:', setCookieHeader);
    
    // Step 2: Test me query with cookies
    console.log('\n2️⃣ Testing me query with cookies...');
    const meData = JSON.stringify({
        query: `
            query Me {
                me {
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
        `
    });

    const meResponse = await makeRequest('http://localhost:4000/graphql', meData, setCookieHeader);
    
    if (meResponse.errors) {
        console.log('❌ Me query failed:', meResponse.errors[0].message);
    } else {
        console.log('✅ Me query successful:', meResponse.data.me);
    }
}

function makeRequest(url, data, cookies = null) {
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

        if (cookies) {
            options.headers['Cookie'] = cookies;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    result.headers = res.headers;
                    resolve(result);
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

// Wait for services to start
setTimeout(() => {
    testAuthFlow();
}, 3000);
