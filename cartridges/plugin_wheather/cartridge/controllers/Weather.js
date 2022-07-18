/* eslint-disable max-len */
/* eslint-disable global-require */
"use strict";

var server = require("server");
var service = require("*/cartridge/services/weatherservice");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

server.get("Show", consentTracking.consent, function (req, res, next) {
  var template = "components/weather/weatherWidget";
  var properties = {};
  var weather = {};
  var svcResult = service.weatherAPIService.call();

  if (svcResult.status === "OK") {
    weather = service.weatherAPIService.getResponse();
    properties.temp = weather.main.temp;
  }

  res.render(template, properties);

  next();
});

module.exports = server.exports();
