const request = require('request'),
      config = require('../../../../../config/spotify');


/*
 * Uses refreshToken to get new accessToken
 * _token: String (Uses config.refToken if not provided)
 */
const refreshToken = (_token) => {
  return new Promise((resolve, reject) => {

    if(!_token && !config.refToken) {
      const msg = "refreshToken: No refreshToken provided";
      console.log(msg);
      return new Error(msg);
    }

    if(!config.refToken)
      config.refToken = _token;

    const refToken = _token ? _token : config.refToken;

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(config.client_id +
        ':' + config.client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refToken
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        config.accToken = access_token;
        resolve(access_token, body, response);
      } else {
        console.log("refreshToken: Unable to fetch refreshToken");
        reject(error);
      }
    });
  });
};

module.exports = {
  refreshToken
};
