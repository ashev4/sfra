var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var CacheMgr = require('dw/system/CacheMgr');

var weatherAPIService = LocalServiceRegistry.createService('Weather.Service', {
  createRequest: function (service, params) {
    var apiKey = service.getConfiguration().getCredential().getPassword();
    var cache = CacheMgr.getCache('WeatherCache');
    var lat = cache.get('lat');
    var lon = cache.get('lon');
    if (typeof lat === 'undefined' && typeof lon === 'undefined') {
      lat = '24.0297';
      lon = '49.8397';
      cache.put('lat', lat);
      cache.put('lon', lon);
    }
    service.setAuthentication('NONE');
    service.addParam('units', 'metric');
    service.addParam('lon', lon);
    service.addParam('lat', lat);
    service.addParam('appid', apiKey);

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
  }
});

module.exports = {
  weatherAPIService: weatherAPIService
};
