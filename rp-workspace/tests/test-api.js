const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing Login API...');
        const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
            email: 'admin@example.com',
            password: 'Password123!' // Matches seed.ts
        });
        console.log('Success:', response.status);
        const data = response.data.data || response.data;
        console.log('Token:', data.accessToken ? 'Received' : 'Missing');
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
