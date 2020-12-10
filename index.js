const axios = require('axios');

if (!process.env.SV_TENANT_TOKEN || !process.env.SV_USER_TOKEN) {
  try {
    require('dotenv').config();
  } catch {
    throw new Error('Missing dotenv package');
  }
}

const asku = (function () {
  'use strict';

  const {
    _curry,
    _identifyArgs,
    _isEmpty,
    _propertyTest,
    _slice,
  } = require('./lib/utils.js');

  const {
    _Config,
    _mixInPageDefaults,
    _normalizeArgs,
  } = require('./lib/helpers.js');


  function getAvailableQuantities(data = {}) {
    const _endpoint = 'inventory/getAvailableQuantities';

    const empty = _isEmpty(data);

    const config = new _Config(_endpoint, empty);

    if (!empty) _mixInPageDefaults(config.data, data);

    return axios(config);
  }

  function getInventoryByLocation(data = {}) {
    const _endpoint = 'inventory/getInventoryByLocation';

    const config = new _Config(_endpoint, false);

    let configData = config.data;

    if (_propertyTest(data, 'ProductSKUs')) {
      configData.IsReturnByCodes = false;
      configData.ProductCodes = data.ProductSKUs;
    }

    if (_propertyTest(data, 'ProductCodes')) {
      configData.IsReturnByCodes = true;
      configData.ProductCodes = data.ProductCodes;
    }

    configData.PageNumber = data.PageNumber || 0;
    configData.PageSize = data.PageSize || null;

    return axios(config);
  }

  function getLocations() {
    const _endpoint = 'inventory/getLocations';

    const config = new _Config(_endpoint);

    return axios(config);
  }

  function getProduct(data = {}) {
    const _endpoint = 'products/getProduct';

    const config = new _Config(_endpoint);

    for (const key in data) {
      if (_propertyTest(data, key)) {
        config.data[key] = data[key];
      }
    }

    return axios(config);
  }

  getProduct({ProductSKU: 'greenair26-a'}).then(response => console.log(response.data.Product));

  function getProducts(data = {}) {
    const _endpoint = 'products/getProducts';

    const empty = _isEmpty(data);

    const config = new _Config(_endpoint, empty);

    if (!empty) _mixInPageDefaults(config.data, data);

    return axios(config);
  }

  return {
    getAvailableQuantities,
    getInventoryByLocation,
    getLocations,
    getProduct,
    getProducts,
  };
})();

module.exports = asku;