const path = require("path"),
      rootPath = path.normalize(__dirname + "/.."),
      env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    mysql: {
      host: '127.0.0.1',
      user: 'thelostone',
      password: 'tgm',
      database: 'porter'
    },
    app: {
      name: 'porter'
    },
    port: process.env.PORT || 8888
  },

  production: {
    root: rootPath,
    mysql: {
      host: '127.0.0.1',
      user: 'thelostone',
      password: 'tgm',
      database: 'porter'
    },
    app: {
      name: 'porter'
    },
    port: process.env.PORT || 8888
  }
};

module.exports = config[env];
