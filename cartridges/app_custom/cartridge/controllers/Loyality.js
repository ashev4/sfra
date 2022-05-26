var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.get('Show', cache.applyShortPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
  var template = 'search/searchResults';
  var CatalogMgr = require('dw/catalog/CatalogMgr');
  var ProductSearchModel = require('dw/catalog/ProductSearchModel');
  var ProductSearch = require('*/cartridge/models/search/productSearch');
  var apiProductSearch = new ProductSearchModel();
  var catalogRoot = CatalogMgr.getSiteCatalog().getRoot();
  var productSearch;

  apiProductSearch.setCategoryID(catalogRoot.getID());
  apiProductSearch.setOrderableProductsOnly(true);
  apiProductSearch.setRecursiveCategorySearch(true);
  apiProductSearch.addRefinementValues('loyalty', 'true');
  apiProductSearch.search();

  productSearch = new ProductSearch(
    apiProductSearch,
    req.querystring,
    req.querystring.srule,
    CatalogMgr.getSortingOptions(),
    CatalogMgr.getSiteCatalog().getRoot()
  );

  if (!productSearch.count) {
    res.setStatusCode(404);
    res.render('error/notFound');
  } else {
    res.render(template, {
      productSearch: productSearch
    });
  }

  next();
});

module.exports = server.exports();
