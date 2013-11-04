var crypto = require('crypto');
var fs = require('fs');
var Hapi = require('hapi');

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

    var filePath = "./locations/" + Date.now() + ".json";
    fs.writeFileSync(filePath, request.payload.locations);

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
