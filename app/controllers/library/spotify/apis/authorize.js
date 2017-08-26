const express = require('express'),
      router = express.Router(),
      request = require('request'),
      querystring = require('querystring'),
      cookieParser = require('cookie-parser'),
      util = require('../../../../helpers/util'),
      authorize = require('../modules/authorize'),
      config = require('../../../../../config/spotify');

module.exports = function(app) {
  app.use('/', router);

  router.get('/login',(req, res) => {
    const state = util.generateRandomString(16);
    res.cookie(config.stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: config.client_id,
        scope: config.scope,
        redirect_uri: config.redirect_uri,
        state: state
      }));
  });

  router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[config.stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
      }));
    } else {
      res.clearCookie(config.stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: config.redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' +
            (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {

          const access_token = body.access_token,
              refresh_token = body.refresh_token;

          config.accToken = access_token;
          config.refToken = refresh_token;

          const options = {
            url: config.base_uri + '/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          request.get(options,(error, response, body) => {
              config.user_info = body;
          });

          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
          }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
          }));
        }
      });
    };
  });

  router.get('/refresh_token',(req, res) => {
    const refresh_token = req.query.refresh_token;
    authorize.refreshToken(refresh_token).then((access_token, response, body) => {
      res.send(access_token);
    }).catch((err) => {
      res.send(err);
    });
  });
};
