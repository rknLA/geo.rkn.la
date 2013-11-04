var crypto = require('crypto');
var Hapi = require('hapi');

var server = Hapi.createServer('localhost', 4450);


var getSignature = function(locationsArray) {
  var hmac = crypto.createHmac('sha256', 'my-secret-key');
  locationsString = JSON.stringify(locationsArray);
  return hmac.update(locationsString).digest('base64');
}

var locations = {
  handler: function(request) {
    console.log("locations: ", request.payload.locations); // the locations payload
    console.log("sent signature: ", request.payload.signature); // the signature sent by the app

    // the signature is computed on the locations object, not the whole request body.
    var computedSignature = getSignature(request.payload.locations);
    console.log("computed signature: ", computedSignature);

    if (computedSignature == request.payload.signature) {
      console.log("SIGNATURES MATCH!");
      request.reply({
        message: "ohai!"
      });
    } else {
      console.log("signature mismatch");
      request.reply({
        error: "invalid HMAC signature"
      });
    }
  },
};

server.route({
  method: "POST",
  path: "/locations",
  config: locations
});

server.start();
