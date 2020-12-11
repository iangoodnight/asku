'use strict';

const { _Config, _mixInPageDefaults, _normalizeArgs } = require('./helpers.js');

function countProps(obj) {
  let count = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++;
    }
  }
  return count;
}

test('_Config builds our config file as expect, respecting defaults', () => {
  const noDefaults = new _Config('test');

  const withDefaults = new _Config('test', true);

  expect(noDefaults.url).toBe('https://app.skuvault.com/api/test');
  expect(countProps(noDefaults.data)).toBe(2);
  expect(withDefaults.url).toBe('https://app.skuvault.com/api/test');
  expect(countProps(withDefaults.data)).toBe(6);
});

test('_mixInPageDefaults sets custom data properties \
	as well as overriding and applying defaults', () => {
  const config = new _Config('test');

  const customData = {
    foo: 'bar',
    baz: [6, 6, 6],
    PageNumber: 3,
  };

  _mixInPageDefaults(config.data, customData);

  expect(config.url).toBe('https://app.skuvault.com/api/test');
  expect(config.data.PageNumber).toBe(3);
  expect(countProps(config.data)).toBe(8);
});

test('_normalizeArgs successful creates arrays, \
	strings, and sets data properties', () => {
  expect(_normalizeArgs('100-FOO')).toEqual({ ProductSKUs: ['100-FOO'] });
  expect(_normalizeArgs('100-FOO', true)).toEqual({
    ProductCodes: ['100-FOO'],
  });
  expect(_normalizeArgs('100-FOO', false, true)).toEqual({
    ProductSKU: '100-FOO',
  });
  expect(_normalizeArgs('100-FOO', true, true)).toEqual({
    ProductCode: '100-FOO',
  });
  expect(_normalizeArgs(['100-FOO', '101-FOO'])).toEqual({
    ProductSKUs: ['100-FOO', '101-FOO'],
  });
  expect(_normalizeArgs(['100-FOO', '101-FOO'], false, true)).toEqual({
    ProductSKU: '100-FOO',
  });
  expect(_normalizeArgs(['100-FOO', '101-FOO'], true, true)).toEqual({
    ProductCode: '100-FOO',
  });
  expect(_normalizeArgs(['100-FOO', '101-FOO'], true)).toEqual({
    ProductCodes: ['100-FOO', '101-FOO'],
  });
  expect(_normalizeArgs({ skus: ['100-FOO', '101-FOO'] }).ProductSKUs).toEqual([
    '100-FOO',
    '101-FOO',
  ]);
  expect(
    _normalizeArgs({ codes: ['100-FOO', '101-FOO'] }, true).ProductCodes
  ).toEqual(['100-FOO', '101-FOO']);
});
