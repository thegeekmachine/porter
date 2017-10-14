const express = require('express'),
      app = express(),
      mysql = require('mysql'),
      init = require('./init/mysql'),
      server = require('http').Server(app),
      config = require('./config/config'),
      glob = require('glob');

const models = glob.sync(config.root + '/app/models/*.js');

models.forEach((model) => {
  require(model);
});

let mysqlClient = mysql.createConnection(config.mysql);
mysqlClient.connect(async err => {
  if (err) {
    console.log("mysql: unable to create connection");
    mysqlClient.end();
    mysqlClient = await init.createDatabase(config.mysql);

    init.setup(mysqlClient).then(() => {
      console.log('mysql connection set up ');
    }).catch(error => console.log(error));

  } else {
    mysqlClient.query(("SHOW TABLES"), (e, result) => {
      if(!result || result.length == 0) {
        init.setup(mysqlClient).then(() => {
          console.log('mysql connection set up ');
        }).catch(error => console.log(error));
      }
    });
  }
});

module.exports = {
  mysqlClient
}

module.exports = require('./config/express')(app, config);

server.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});
