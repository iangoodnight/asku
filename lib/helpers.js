'use strict';

const { 
  _curry,
  _identifyArgs,
  _propertyTest,
  _slice  
} = require('./utils.js');

module.exports = {
  _Config: function(endpoint = '', defaults = false) {
    const _method = 'POST';

    const _urlRoot = 'https://app.skuvault.com/api/';

    const _headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    let _url;

    if (endpoint !== '') {
      _url = _urlRoot + endpoint;
    } else {
      throw new Error('SkuVault API endpoint not provided');
    }

    const _data = {
      TenantToken: process.env.SV_TENANT_TOKEN, // Add some fallbacks here
      UserToken: process.env.SV_USER_TOKEN, // Add some fallbacks here
    };

    if (defaults === true) module.exports._mixInPageDefaults(_data);

    return {
      method: _method,
      url: _url,
      headers: _headers,
      data: _data,
    };
  },
  _mixInPageDefaults: function(data, preset = {}) {
    const _defaults = {
      ModifiedAfterDateTimeUtc: '0000-00-00T00:00:00.0000000Z',
      ModifiedBeforeDateTimeUtc: '0000-00-00T00:00:00.0000000Z',
      PageNumber: 0,
      PageSize: null,
    };
  
    try {
      for (const key in _defaults) {
        if (_propertyTest(_defaults, key) && !_propertyTest(data, key)) {
          data[key] = preset[key] || _defaults[key];
        }
      }
      for (const key in preset) {
        if (_propertyTest(preset, key) && !_propertyTest(data, key)) {
          data[key] = preset[key];
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  _normalizeArgs: function(args = {}, preferCode = false, string = false) {
    switch (_identifyArgs(args)) {
      case 'string':
        if (!preferCode) {
          if (!string) return { ProductSKUs: [args] };
          return { ProductSKU: args };
        }
        if (!string) return { ProductCodes: [args] };
        return { ProductCode: args };
        break;
      case 'array':
        const length = args.length;
        if (!preferCode) {
          if (!string) return { ProductSKUs: [...args] };
          if (!!length) return { ProductSKU: args[0] };
        }
        if (!string) return { ProductCodes: [...args] };
        if (!!length) return { ProductCode: args[0] };
        break;
      case 'object':
        let test = _curry(_propertyTest)(args);
        if (!preferCode) {
          if (!string) {
            if (!test('ProductSKUs')) args['ProductSKUs'] = args['skus'] || [];
            if (_identifyArgs(args['ProductSKUs']) !== 'array') {
              args['ProductSKUs'] = _slice(args['ProductSKUs']);
            }
            return args;
          }
          if (!test('ProductSKU')) {
            args['ProductSKU'] = args['skus'] || args['sku'] || '';
          }
          return args;
        }
        if (!string) {
          if (!test('ProductCodes')) {
            args['ProductCodes'] = args['codes'] || [];
          }
          if (_identifyArgs(args['ProductCodes']) !== 'array') {
            args['ProductCodes'] = _slice(args['ProductCodes']);
          }
          return args;
        }
        if (!test('ProductCode')) {
          args['ProductCode'] = args['code'] || args['codes'] || '';
        }
        return args;
        break;
      default:
        break;
    }
  },
};