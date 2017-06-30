var spawn = require('child_process').spawn;
var server = require('./app');
var port = 3000;

var toclose = server.listen(port, function() {
  console.log('Server running on port: %d', port);
  setTimeout(runTests, 10000);
});

var runTests = function() {
  var casper = spawn('npm', ['run', 'test-integration']);
  casper.stdout.pipe(process.stdout);

  casper.on('error', function (error)  {
    console.log('ERROR: ' + error);
    toclose.close(function() {
      process.exit(1);
    });
  });

  casper.on('close', function (code) {
    toclose.close(function() {
      process.exit(code);
    });
  });
};
