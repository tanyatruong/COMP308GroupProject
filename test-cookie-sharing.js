const http = require('http');

// Test cookie sharing between shell app and business app
async function testCookieSharing() {
    console.log('🧪 Testing cookie sharing between shell app and business app...\n');

    try {
        // Step 1: Login through shell app (localhost:5173)
        console.log('1️⃣ Logging in through shell app...');
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
        
        console.log('🍪 Cookies received:', setCookieHeader[0]);
        
        // Step 2: Test business app with cookies (simulating what happens when redirected)
        console.log('\n2️⃣ Testing business app with cookies (localhost:3003)...');
        const businessResponse = await makeRequest('http://localhost:3003', '', setCookieHeader);
        
        if (businessResponse.includes('john_doe') || businessResponse.includes('Resident')) {
            console.log('✅ Business app detected authentication via cookies!');
        } else if (businessResponse.includes('Login') || businessResponse.includes('Welcome')) {
            console.log('❌ Business app showing login page - cookies not shared properly');
        } else {
            console.log('⚠️ Business app response unclear');
        }
        
        // Step 3: Test /resident route specifically
        console.log('\n3️⃣ Testing /resident route with cookies...');
        const residentResponse = await makeRequest('http://localhost:3003/resident', '', setCookieHeader);
        
        if (residentResponse.includes('john_doe') || residentResponse.includes('Resident')) {
            console.log('✅ /resident route works with authentication!');
        } else if (residentResponse.includes('Login') || residentResponse.includes('Welcome')) {
            console.log('❌ /resident route showing login page - cookies not shared');
        } else {
            console.log('⚠️ /resident route response unclear');
        }
        
    } catch (error) {
        console.log('❌ Error testing cookie sharing:', error.message);
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
    testCookieSharing();
}, 3000);
