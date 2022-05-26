/* eslint-disable max-len */
/* eslint-disable global-require */
'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

/**
 * Product-Show : This endpoint is called to validate the availability of the Loyality products for logged users
 * @param {object} product - Product object
 * @param {object} customer - Customer object
 * @returns {boolean}
 */
function checkLoyaltyAvailability(product, customer) {
  var collections = require('*/cartridge/scripts/util/collections');
  var ifCustomerInLoyaltyGroup = false;
  var isLoyaltyAvailable = false;

  if (product.attributes == null) return true;

  product.attributes.forEach(function (attribute) {
    if (attribute.ID === 'Loyality') isLoyaltyAvailable = true;
  });

  collections.forEach(customer.customerGroups, function (group) {
    if (group.ID === 'VIP') ifCustomerInLoyaltyGroup = true;
  });

  return (
    customer.authenticated &&
    ifCustomerInLoyaltyGroup &&
    isLoyaltyAvailable
  );
}

server.append('Show', function (req, res, next) {
  var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
  var showProductPageHelperResult = productHelper.showProductPage(
    req.querystring,
    req.pageMetaData
  );
  var product = showProductPageHelperResult.product;
  var customer = req.currentCustomer.raw;
  var isAvailable = checkLoyaltyAvailability(product, customer);

  // if (!isAvailable) {
  //   res.setStatusCode(404);
  //   res.render('error/notFound');
  // }

  next();
});

module.exports = server.exports();
