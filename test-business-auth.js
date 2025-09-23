const http = require('http');

// Test if the business app can detect authentication
async function testBusinessAuth() {
    console.log('🧪 Testing business app authentication...\n');

    try {
        // First, login to get a cookie
        console.log('1️⃣ Logging in to get authentication cookie...');
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
        
        console.log('✅ Login successful');
        
        // Extract cookies
        const setCookieHeader = loginResponse.headers?.['set-cookie'];
        if (!setCookieHeader) {
            console.log('❌ No cookies set');
            return;
        }
        
        console.log('🍪 Cookies received');
        
        // Test business app with cookies
        console.log('\n2️⃣ Testing business app with authentication...');
        const businessResponse = await makeRequest('http://localhost:3003', '', setCookieHeader);
        
        if (businessResponse.includes('john_doe') || businessResponse.includes('Resident')) {
            console.log('✅ Business app detected authentication!');
        } else if (businessResponse.includes('Login') || businessResponse.includes('Welcome')) {
            console.log('❌ Business app showing login page - authentication not detected');
        } else {
            console.log('⚠️ Business app response unclear');
        }
        
    } catch (error) {
        console.log('❌ Error testing business app:', error.message);
    }
}

function makeRequest(url, data, cookies = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(data) : 0
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
                    if (data) {
                        const result = JSON.parse(body);
                        result.headers = res.headers;
                        resolve(result);
                    } else {
                        resolve(body);
                    }
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

// Wait for services to start
setTimeout(() => {
    testBusinessAuth();
}, 3000);
