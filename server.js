var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Hypertube server listening on port ' + port);
});

server.timeout = 220000;