
angular.module('bkRulesLab', [])
.controller('bkLabController', function($scope) {
  $scope.rule = theRule();
  $scope.payment_volume = [{'gte':124},{'lt':490}];
})
.directive('selectInput', function (/*Range*/) {
  return {
    restrict: 'E',
    scope: { 
      options: '=' // [{'gt':'>'},{'gte':'≥'}]
    },
    require: 'ngModel',
    templateUrl: '../panel/bk/views/constraint/select_input.html',
    link: function(scope, element, attrs, ngModelCtrl) {

      // modelValue -> viewValue
      ngModelCtrl.$formatters.push(function(modelValue) { // {gt:123}
        var operator = scope.getKey(modelValue);
        var operand = scope.getValue(modelValue);
        var selection = scope.options.filter(function(option) {
          return typeof option[operator] !== 'undefined';
        });
        return { // return value becomes viewValue
          selection: selection[0],
          operand: operand
        };
      });

      // viewValue -> modelValue
      ngModelCtrl.$parsers.push(function(viewValue) { // {selection:{'gt':'>'},operand:123}
        var result = {}; // will become {gt:123}
        try {
          if (undef(viewValue.selection) || undef(viewValue.operand)) {
            throw 'undef';
          }
          if (viewValue.operand === '') {
            result = {}; throw 'null';
          }
          result[scope.getKey(viewValue.selection)] = viewValue.operand;
        } catch (exc) {} finally {
          return result; // return value becomes modelValue
        }
        function undef(thing) { return typeof thing === 'undefined'; }
      });

      // viewValue -> isolated scope
      ngModelCtrl.$render = function() {
        scope.selection = ngModelCtrl.$viewValue.selection;
        scope.operand = ngModelCtrl.$viewValue.operand;
      };

      // isolated scope -> viewValue
      scope.$watchGroup(['selection', 'operand'], function(newValues, oldValues) {
        
        ngModelCtrl.$setViewValue({
          selection: scope.selection, // {gt:'>'}
          operand: scope.operand
        });
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
     }
  };
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