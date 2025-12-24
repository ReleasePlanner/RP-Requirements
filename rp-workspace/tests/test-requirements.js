const axios = require('axios');

async function testRequirements() {
    try {
        // Authenticate as Admin to get Token
        console.log('Authenticating...');
        const authRes = await axios.post('http://localhost:3000/api/v1/auth/login', {
            email: 'admin@example.com',
            password: 'Password123!'
        });

        // NestJS TransformInterceptor wrapper
        const token = authRes.data.data.accessToken;
        console.log('Token acquired:', token ? 'Yes' : 'No');

        // Fetch Requirements
        console.log('Fetching Requirements...');
        const reqRes = await axios.get('http://localhost:3000/api/v1/requirements', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Status:', reqRes.status);
        console.log('Data:', JSON.stringify(reqRes.data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.status, error.response.data);
        }
    }
}

testRequirements();
