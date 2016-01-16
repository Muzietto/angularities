'use strict';

/* Filters */

angular.module('onebip.panel.bk.filters', [])
.filter('constraintKeyToString', function (constraintMap, constraintsMap) {
  return function (text) {
    return constraintMap[text] || constraintsMap[text] || '';
  }
});