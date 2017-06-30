#! /usr/bin/env node
'use strict';

// Deployment tracking
require('cf-deployment-tracker-client').track();

var server = require('./app');
var port = 3000;

server.listen(port, function() {
  console.log('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
