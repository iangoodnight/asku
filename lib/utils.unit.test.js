'use strict';

const {
  _curry,
  _identifyArgs,
  _isEmpty,
  _propertyTest,
  _slice,
} = require('./utils.js');

test('curry works as expected', () => {
	function add(a,b) {
		return a + b;
	}
	function isFunction(f) {
		return _identifyArgs(f) === 'function';
	}
	expect(isFunction(_curry(add))).toBeTruthy();
	expect(isFunction(_curry(add)(4))).toBeTruthy();
	expect(_curry(add)(4)(2)).toBe(6);
});

test('_identifyArgs recognizes strings', () => {
	expect(_identifyArgs([])).not.toBe('string');
	expect(_identifyArgs('foo')).toBe('string');
});

test('_identifyArgs recognizes arrays', () => {
	expect(_identifyArgs('foo')).not.toBe('array');
	expect(_identifyArgs(['foo', 'bar', 666])).toBe('array');
});

test('_identifyArgs recognizes objects', () => {
	expect(_identifyArgs('foo')).not.toBe('object');
	expect(_identifyArgs({})).toBe('object');
});

test('_isEmpty returns true only for empty objects', () => {
	expect(_isEmpty([])).toBeFalsy();
	expect(_isEmpty('')).toBeFalsy();
	expect(_isEmpty(null)).toBeFalsy();
	expect(_isEmpty({})).toBeTruthy();
});

test('_propertyTest correctly identifies own properties', () => {
	const testObj = {
		foo: 'bar',
		baz: [1, 2, 3],
	};
	expect(_propertyTest(testObj, 'foo')).toBeTruthy;
	expect(_propertyTest(testObj, 'baz')).toBeTruthy;
	expect(_propertyTest(testObj, 'zub')).toBeFalsy;
});

test('_slice converts non-arrays to arrays', () => {
	function isArray(arr) {
		return _identifyArgs(arr) === 'array';
	}
	expect(isArray(_slice('foo'))).toBeTruthy();
	expect(isArray(_slice(2))).toBeTruthy();
	expect(isArray(_slice({}))).toBeTruthy();
	expect(isArray(_slice([]))).toBeTruthy();
});