const express = require('express'),
      glob = require('glob'),
      logger = require('morgan'),
      compress = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      methodOverride = require('method-override');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.set('view engine', 'pug');
  app.set('views', (config.root + '/public/'));

  const controllers = glob.sync(config.root + '/app/controllers/**/**/**/*.js');
  controllers.forEach((controller) => {
    if(!controller.includes('/modules/')) {
      require(controller)(app);
    }
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
