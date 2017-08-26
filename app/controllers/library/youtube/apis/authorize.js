const express = require('express'),
      router = express.Router(),
      _ = require('underscore'),
      auth = require('../modules/authorize'),
      config = require('../../../../../config/config'),
      _token = require(config.root + '/config/youtube');

module.exports = function(app) {
  app.use('/', router);

  router.get('/youtube/login', (req, res) => {
    if(req.query.code) {
      auth.setToken(req.query.code);
      res.send("Logged in!");
    } else if(_.isEmpty(_token.Oauth2Client)) {
      // TODO: Replace ^ with DB call
      res.redirect(auth.authorize(_token.credentials));
    } else {
      res.send("Already logged in!");
    }
  });
};
