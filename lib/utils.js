'use strict';

module.exports = {
  _curry: function (f) {
    return function (a) {
      return function (b) {
        return f(a, b);
      };
    };
  },
  _identifyArgs: function (args) {
    let identity = undefined;
    switch (Object.prototype.toString.call(args)) {
      case '[object Array]':
        identity = 'array';
        break;
      case '[object Function]':
        identity = 'function';
        break;
      case '[object Object]':
        identity = 'object';
        break;
      case '[object String]':
        identity = 'string';
        break;
      case '[object Number]':
        identity = 'number';
        break;
      default:
        break;
    }
    return identity;
  },
  _isEmpty: function (obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
    for (const key in obj) {
      if (_propertyTest(obj, key)) {
        return false;
      }
    }
    return true;
  },
  _propertyTest: function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  },
  _slice: function (x) {
    const typeArg = Object.prototype.toString.call(x);
    let arr;
    if (typeArg === '[object String]' || typeArg === '[object Number]') {
      return [x];
    }
    if (typeArg === '[object Array]') return x;
    try {
      arr = Array.prototype.slice.call(x);
    } catch {
      arr = [x];
    }
    return arr;
  },
};
