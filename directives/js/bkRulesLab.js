
angular.module('bkRulesLab', [])
.controller('bkLabController', function($scope) {
  $scope.rule = theRule();
})
.directive('constraintPaymentVolume', function (/*Range*/) {
  return {
    restrict: 'E',
    scope: { key : '=' },
    controller: function ($scope) {
      if (angular.isString($scope.rule.constraints.payment_volume)) {
        $scope.rule.constraints.payment_volume = Range.fromString($scope.rule.constraints.payment_volume);
      }
    },
    templateUrl: '../panel/bk/views/constraint/payment_volume.html'
  }
});

function theRule() {
  return {
/*  "priority": 0,
    "toDelete": false,*/
    "key": "MERCHANT_REVENUE_SHARE",
/*    "value": {
      "revenue-share": [
        0,
        "%"
      ],
      "applied-to": null
    },
    "constraintsKeys": [
      "payment_method",
      "country",
      "credit_provider",
      "merchant",
      "payment_volume",
      "amount",
      "container_amount",
      "connectivity",
      "route",
      "container_kind",
      "business_model",
      "service",
      "category",
      "context"
    ],*/
    "constraints": {
      "payment_method": "any",
      "country": "any",
      "credit_provider": "any",
      "merchant": "any",
      "payment_volume": {
        "from": {
          "operator": "",
          "value": ""
        },
        "to": {
          "operator": "",
          "value": ""
        }
      },
      "amount": "any",
      "container_amount": "any",
      "connectivity": "any",
      "route": "any",
      "container_kind": "any",
      "business_model": "any",
      "service": "any",
      "category": "any",
      "context": "any"
    }/*,
    "_id": {
      "$id": "new-0"
    }*/
  }
}