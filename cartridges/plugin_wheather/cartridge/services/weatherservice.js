var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

var weatherAPIService = LocalServiceRegistry.createService("Weather.Service", {
  createRequest: function (service, params) {
    var apiKey = service.getConfiguration().getCredential().getPassword();
    service.setAuthentication("NONE");
    service.addParam("units", "metric");
    service.addParam("lon", "49.8397");
    service.addParam("lat", "24.0297");
    service.addParam("appid", apiKey);

    return params;
  },
  parseResponse: function (service, client) {
    var result;

    try {
      result = JSON.parse(client.text);
    } catch (e) {
      result = client.text;
    }
    return result;
  },
});

module.exports = {
  weatherAPIService: weatherAPIService,
};
