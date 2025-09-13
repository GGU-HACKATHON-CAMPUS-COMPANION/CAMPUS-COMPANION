const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'password123',
  studentId: 'STU001'
};

const testLogin = {
  email: 'john@test.com',
  password: 'password123'
};

async function testAPI() {
  try {
    console.log('🚀 Testing Campus Companion API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', health.data);

    // Test register
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', {
      user: registerResponse.data.user,
      tokenReceived: !!registerResponse.data.token
    });

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testLogin);
    console.log('✅ Login successful:', {
      user: loginResponse.data.user,
      tokenReceived: !!loginResponse.data.token
    });

    // Test protected route (get announcements)
    console.log('\n4. Testing announcements endpoint...');
    const announcementsResponse = await axios.get(`${BASE_URL}/announcements`);
    console.log('✅ Announcements retrieved:', announcementsResponse.data.length, 'items');

    // Test protected route with auth token
    console.log('\n5. Testing protected timetable endpoint...');
    const token = loginResponse.data.token;
    const timetableResponse = await axios.get(`${BASE_URL}/timetables`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Timetable retrieved (protected route):', timetableResponse.data.length, 'items');

    console.log('\n🎉 All tests passed! Backend is working perfectly.');

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server not running. Please start the server first with: npm start');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

// Run tests
testAPI();