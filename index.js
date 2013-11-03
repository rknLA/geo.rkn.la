var Hapi = require('hapi');
var winston = require('winston');

var server = Hapi.createServer('localhost', 4450);

var locations = {
  handler: function(request) {
    winston.info("request data: ", request.payload);
    request.reply({
      message: "ohai!"
    });
  },
};

server.route({
  method: "POST",
  path: "/locations",
  config: locations
});

server.start();
