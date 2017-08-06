const express = require('express'),
      router = express.Router(),
      search = require('../modules/search');

const LOGIN_URL = "http://localhost:8888/login";

module.exports = (app) => {
  app.use('/', router);

  router.get('/spotify/search', (req, res) => {
    let searchItem = {
      type: ['track'],
      query: "To all of you",
      limit: 5,
      market: 'US'
    };

    search.searchBox(searchItem).then((matches, response) => {
      res.send(matches);
    }).catch((error) => {
      console.log(error);
      if(error.msg.includes("access_token is null"))
        res.redirect(LOGIN_URL);
      else
        res.send(error);
    });
  });
};
