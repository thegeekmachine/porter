const googleAuth = require('google-auth-library'),
      config = require('../../../../../config/config'),
      _ = require('underscore');

let _token = require(config.root + '/config/youtube');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials) => {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  //TODO: Replace with DB call
  let client_token = _token.client_token;

  if(_.isEmpty(client_token)) {
    return getNewToken(oauth2Client);
  } else {
    oauth2Client.credentials = client_token;
    // TODO: Update DB
    _token.Oauth2Client = oauth2Client;
    // TODO: Fix redirection
    return "/";
  }
}

/**
 * Get and store new token after prompting for user authorization
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 */
const getNewToken = (oauth2Client) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: _token.scopes
  });

  return authUrl;
}

const setToken = async (code) => {
  const credentials = _token.credentials;
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      throw (err);
    }
    oauth2Client.credentials = token;

    //TODO: write to DB
    _token.Oauth2Client = oauth2Client;
  });
}

module.exports = {
  authorize,
  setToken
}
