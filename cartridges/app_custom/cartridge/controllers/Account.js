/* eslint-disable max-len */
/* eslint-disable global-require */
'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

server.append('Show', function (req, res, next) {
  var URLUtils = require('dw/web/URLUtils');
  var collections = require('*/cartridge/scripts/util/collections');
  var customer = req.currentCustomer.raw;
  var ifCustomerInLoyaltyGroup = false;

  collections.forEach(customer.customerGroups, function (group) {
    if (group.ID === 'VIP') ifCustomerInLoyaltyGroup = true;
  });

  res.render('account/accountDashboard', {
    ifCustomerinLoyality: ifCustomerInLoyaltyGroup,
    loyalityListUrl: URLUtils.url('Loyality-Show').toString()
  });
  next();
});

module.exports = server.exports();
