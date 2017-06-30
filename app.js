/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express'),
  //create a new express server
  app = express(),
  extend = require('util')._extend,
  path = require('path');
  pkg = require('./package.json'),
  fs = require('fs'),
  webpack = require('webpack'),
  webpackMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-hot-middleware'),
  config = require('./webpack.config.js'),
  watson = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);
require('dotenv').config();
var discovery = require('./lib/api/discovery');

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

app.use(allowCrossDomain);


app.get('/discovery/getCollections', (req, res, next) => {
  return discovery.getCollections(req, res, next);
});

app.get('/discovery/query', (req, res, next) => {
  return discovery.query(req, res, next);
});

// Setting up webpack server
var isDeveloping = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    //res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

module.exports = app;
