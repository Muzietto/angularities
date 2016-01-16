'use strict';

/* Services */

angular.module('onebip.panel.bk.services', [])
.service('Range', function (Numeral, OperatorsMaps) {

  function getOperatorValue(value) {
    var result = { operator: '', value: '' };
    var opVal;
    if (angular.isString(value)
      && (opVal = value.split(' '))
      && opVal.length === 2) {
      for (var i in OperatorsMaps) {
        if (OperatorsMaps.hasOwnProperty(i)
          && OperatorsMaps[i] === opVal[0]) {
          result.operator = i;
          result.value = Numeral().unformat(opVal[1]);
          break;
        }
      }
    }
    return result;
  };

  function parseRange(rangeObject) {
    var objectConstraintValue = [];

    angular.forEach(rangeObject, function (value, key) {
      value = ((typeof value === 'number') ? Numeral(value).format('0,0.00') : value);

      if (OperatorsMaps.hasOwnProperty(key)) {
        objectConstraintValue.push(OperatorsMaps[key] + ' ' + value);
      }
    });

    return objectConstraintValue.join(' and ');
  };

  this.fromString = function (value) {
    var fromTo = value.split(' and ');
    return {
      from: getOperatorValue(fromTo[0] || ''),
      to: getOperatorValue(fromTo[1] || '')
    };
  };

  this.toString = function (rangeObject) {

    var range = rangeObject;
    if (rangeObject.hasOwnProperty('from') && rangeObject.hasOwnProperty('to')) {
      range = {};
      if (rangeObject.hasOwnProperty('from')) {
        range[rangeObject.from.operator] = rangeObject.from.value;
      }
      if (rangeObject.hasOwnProperty('to')) {
        range[rangeObject.to.operator] = rangeObject.to.value;
      }
    }
    return parseRange(range);
  };

  this.getRange = function (rangeObject) {

    // CASE 1: it is already a Range
    if (rangeObject.hasOwnProperty('from')) return rangeObject;

    // CASE 2: it is a remote object, needs parsing
    var operators = [];
    angular.forEach(rangeObject, function (value, key) {
      if (OperatorsMaps.hasOwnProperty(key)) {
        operators.push({ operator: key, value: value });
      }
    });
    return { from: operators[0] || {}, to: operators[1] || {} };
  };

  this.isRange = function (amount) {
    return angular.isObject(amount) && !angular.isArray(amount);
  };
})
;
