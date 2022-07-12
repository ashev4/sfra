var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

var weatherAPIService = LocalServiceRegistry.createService("Weather.Service", {
  createRequest: function (service, params) {
    var apiKey = service.getConfiguration().getCredential().getPassword();
    service.setRequestMethod("GET");
    service.addHeader("Accept", "application/json");
    service.setAuthentication("NONE");
    service.addParam("lon", "49.43771188816319");
    service.addParam("lat", "26.96915895669814");
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
