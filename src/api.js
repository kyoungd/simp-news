const axios = require('axios');
const dotenv = require('dotenv');

async function loginUser(username, password){
  try {
    const url = process.env.LOGIN_URL || 'http://localhost:1337/api/auth/local';
    const response = await axios.post(url, {identifier: username, password: password});
    // Handle success.
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
    return response.data.jwt;
  }
  catch (error) {
    console.log(error);
  }
}
  
module.exports = { loginUser };
