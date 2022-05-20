var server = require('server');

server.get('Show', function (req, res, next) {
  var template = 'loyality';

  res.render(template, {

  });
  next();
});

module.exports = server.exports();
