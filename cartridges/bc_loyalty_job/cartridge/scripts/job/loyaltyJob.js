'use strict';

var io = require('dw/io');
var ProductMgr = require('dw/catalog/ProductMgr');
var FileWriter = io.FileWriter;
var File = io.File;

/**
 * Generates product .csv line record
 * @param {dw.ProductMgr.queryAllSiteProductsSorted} product
 * @returns {String}
 */
function generateProductData(product) {
  var productCsv = [];
  var inStockQ;
  var productInventoryRecord = product
    .getAvailabilityModel()
    .getInventoryRecord();

  if (productInventoryRecord !== null) {
    inStockQ = product
      .getAvailabilityModel()
      .getInventoryRecord()
      .getATS().value;
  } else {
    inStockQ = 0;
  }
  productCsv.push(product.getID());
  productCsv.push(product.getName());
  productCsv.push(inStockQ);
  productCsv.push(product.getPriceModel().getPrice());
  return productCsv.join(',');
}

/**
 * Checks product for loyality group
 * @param {dw.ProductMgr.queryAllSiteProductsSorted} product
 * @returns {Boolean}
 */
function checkLoyaltyAvailability(product) {
  var isLoyaltyAvailable = false;
  var attributeGroups = product.getAttributeModel().getAttributeGroups();

  if (attributeGroups == null) return false;

  for (var i = 0; i < attributeGroups.size; i++) {
    if (attributeGroups.hasNext()) {
      if (attributeGroups.next().ID === 'Loyality') {
        isLoyaltyAvailable = true;
      }
    }
  }

  return isLoyaltyAvailable;
}

module.exports = {
  exportProducts: function exportProducts() {
    var file = new File(io.File.IMPEX + '/loyalty_feed.csv');
    var fileWriter = new FileWriter(file, 'UTF-8');
    var products = ProductMgr.queryAllSiteProductsSorted();
    var count = products.getCount();
    fileWriter.writeLine('id,title,inventory level,price');

    for (var i = 0; i < count; i++) {
      if (products.hasNext() && checkLoyaltyAvailability(products.next())) {
        fileWriter.writeLine(generateProductData(products.next()));
      }
    }

    fileWriter.close();
    products.close();
  }
};
