var crypto = require('crypto');
var fs = require('fs');
var Hapi = require('hapi');
var moment = require('moment');

var server = Hapi.createServer('localhost', 4450);


var getSignature = function(locationsArray) {
  var hmac = crypto.createHmac('sha256', 'my-secret-key');
  locationsString = JSON.stringify(locationsArray);
  return hmac.update(locationsString).digest('base64');
}

var locations = {
  handler: function(request) {

    // the signature is computed on the locations object, not the whole request body.
    var computedSignature = getSignature(request.payload.locations);
    console.log("computed signature: ", computedSignature);

    if (computedSignature != request.payload.signature) {
      request.reply({
        error: "invalid HMAC signature"
      });
    }

    var now = moment();
    var filePath = ['.', 'locations', now.year(), now.month(), now.date(), now.unix() + ".json"].join('/');

    fs.writeFileSync(filePath, JSON.stringify(request.payload.locations));

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
