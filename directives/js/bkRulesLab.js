
angular.module('bkRulesLab', [])
.controller('bkLabController', function($scope) {
  $scope.rule = theRule();
  $scope.payment_volume = [{'gt':123},{'lt':500}];
})
.directive('selectInput', function (/*Range*/) {
  return {
    restrict: 'E',
    //require: 'ngModel',
    scope: {
      //setModel : '&',
      //the_model : '=',
      options : '=',
      selection: '@',
      //operator : '=',
      operand  : '@'
    },
    link: function(scope, element, attrs) {
      scope.$watchGroup(['selection', 'operand'], function(newValues, oldValues) {
        if (undef(newValues[0]) || undef(newValues[1])) return;
        if (newValues[1] === '') {
          delete scope.result;
          return;
        }
        scope.result = {};
        scope.result[scope.getKey(newValues[0])] = newValues[1];
        function undef(thing) { return typeof thing === 'undefined'; }
      });
    },
    controller: function ($scope) {
      $scope.getKey = function(obj) {
        try {
          return Object.keys(obj)[0];
        } catch (e) {}
      };
      $scope.getValue = function(obj) {
        try {
          return obj[Object.keys(obj)[0]];
        } catch (e) {}
      };
      //$scope.the_model = 'qweqwe';
   },
    templateUrl: '../panel/bk/views/constraint/select_input.html'
  }
})
.directive('constraintPaymentVolume', function (/*Range*/) {
  return {
    restrict: 'E',
    scope: { key : '=' },
    controller: function ($scope) {
 //     if (angular.isString($scope.rule.constraints.payment_volume)) {
 //       $scope.rule.constraints.payment_volume = Range.fromString($scope.rule.constraints.payment_volume);
//      }
    },
    templateUrl: '../panel/bk/views/constraint/payment_volume.html'
  }
})
.directive('constraintCountry', function ($http) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
    },
    templateUrl: '../panel/bk/views/constraint/select.html',
    link: function(scope, elem, attrs) {
      // need an operator that reads 'any' in the model
      // and puts it as the selected option
    }
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
      "payment_volume": [{'gt':123},{'lt':500}],
//        "from": {
//          "operator": "",
//          "value": ""
//        },
//        "to": {
//          "operator": "",
//          "value": ""
//        }
//      ],
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