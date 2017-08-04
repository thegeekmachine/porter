const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      config = require('./config/config'),
      glob = require('glob');

const models = glob.sync(config.root + '/app/models/*.js');

models.forEach((model) => {
  require(model);
});

module.exports = require('./config/express')(app, config);

server.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});
