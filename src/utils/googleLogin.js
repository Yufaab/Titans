const axios = require('axios');

exports.login = async (accessToken) => {
  try {
    const options = {
      method: 'GET',
      url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    };
    const res = await axios(options);
    return res;
  } catch (e) {
    throw new Error(e);
  }
}