'use strict';

/* Controllers */

angular.module('onebip.panel.bk.controllers', [])
.controller('BkList', function ($scope, string, ConstraintsFilter, Security, RuleManager) {
  $scope.security = Security
})

.controller('constraintsFilterCtrl', function ($scope, string, ConstraintsFilter, $http) {
  $scope.filter = {
    currentKey: null,
    keys: ConstraintsFilter.keys,
    loading: false,
    availableFilters: ConstraintsFilter.availableFilters,
    filtersData: {},
    filterKey: ''
  };

  $scope.$watch('filter.currentKey', function (key, oldKey) {
    if (!!key || !!oldKey) ConstraintsFilter.setCurrentKey(key);
  });

  var unloading = ConstraintsFilter.onLoading(function (loading) {
    $scope.filter.loading = loading;
    $scope.filter.availableFilters = ConstraintsFilter.availableFilters;
  });
  $scope.$on('$destroy', unloading);

  $scope.addFilter = function (key) {
    if (!$scope.filter.filtersData.hasOwnProperty(key) || !$scope.filter.filtersData[key].value) {
      alert('Key not found: ' + key);
      return;
    }

    ConstraintsFilter.add(key, $scope.filter.filtersData[key].value);
  }

  $scope.removeFilter = function (key) {
    if (!$scope.filter.filtersData.hasOwnProperty(key)) {
      alert('Key not found: ' + key);
      return;
    }

    delete $scope.filter.filtersData[key];
    ConstraintsFilter.remove(key);
  }

  $scope.loadFilter = function (key) {
    ConstraintsFilter.loadFilterData($scope.filter.currentKey, key)
    .success(function (data) {
      $scope.filter.filtersData[key] = data;
      $scope.filter.filterKey = '';
    });
  }

  $scope.removeAllFilters = function () {
    $scope.filter.filtersData = {};
    ConstraintsFilter.setCurrentKey($scope.filter.currentKey);
  }
  
})

.controller('rulesListCtrl', function ($scope, ConstraintsFilter, RuleManager, Security) {

  $scope.ruleList = {
    isLoading: false,
    keyIsEditable: false,
    constraintsKeys: []
  };

  $scope.editRule = function (rule) {
    RuleManager.edit(rule);
  }

  $scope.cloneRule = function (rule) {
    RuleManager.clone(rule);
  }

  $scope.deleteRule = function (rule) {
    RuleManager.remove(rule);
  }

  $scope.createRule = function (rule) {
    var newRule = RuleManager.create(ConstraintsFilter.key);
    // no need to put it in the scope, because onAddRule takes care of that
  }

  $scope.filterPaginated = function () {
    // the scroll check is inside the ConstraintsFilter's factory
    ConstraintsFilter.filterPaginated();
  }

  /******************* Events ********************/

  var offLoading = ConstraintsFilter.onLoading(function (loading) {
    $scope.ruleList.isLoading = loading;
    if (!loading) {
      $scope.ruleList.rules = ConstraintsFilter.rules;
      $scope.ruleList.distinctConstraintsKeys = ConstraintsFilter.distinctConstraintsKeys;
    }
  });

  var offChangeKey = ConstraintsFilter.onChangeKey(function (key) {
    $scope.ruleList.key = ConstraintsFilter.key;
    $scope.ruleList.keyIsEditable = Security.canEditKey(ConstraintsFilter.key);
  });

  $scope.$on('$destroy', function () {
    offLoading();
    offChangeKey();
  });

})

.controller('cartCtrl', function ($scope, Utils, ConstraintsFilter, RuleManager) {

  $scope.cart = {
    rulesLength: 0,
    messages: [],
    failureMessages: [],
    rules: {}
  };

  $scope.prioptions = {
    from: 0,
    to: 100,
    step: 1,
    stepClick: 5,
    scale: [0, '|', 10, '|', 20, '|', 30, '|', 40, '|', 50, '|', 60, '|', 70, '|', 80, '|', 90, '|', 100]
  };

  var addRuleToCart = function (rule) {
    $scope.cart.rules[rule._id['$id']] = rule;
    $scope.cart.rulesLength = Utils.ObjectSize($scope.cart.rules);
  }

  $scope.cloneRule = function (rule) {
    RuleManager.clone(rule);
  }

  $scope.removeRule = function (rule) {
    if (!rule || !rule._id || !rule._id.$id) return;
    delete $scope.cart.rules[rule._id.$id];
    $scope.cart.rulesLength = Utils.ObjectSize($scope.cart.rules);
  }

  $scope.saveAll = function () {
    var rules = angular.copy($scope.cart.rules);
    $scope.cart.rules = {};
    $scope.cart.rulesLength = 0;

    var completed = function (id) {
      delete rules[id];
      ConstraintsFilter.filter();
    }

    angular.forEach(rules, function (rule, id) {
      RuleManager.api.save(rule, function (success, errorCodeOrSuccessMessage, errorObj) {
        if (success) {
          $scope.cart.messages.push(errorCodeOrSuccessMessage);
        } else {
          addRuleToCart(rule);
          $scope.cart.failureMessages.push('Error Code: ' + errorCodeOrSuccessMessage + '; Error Message: ' + errorObj.error);
        }
        completed(rule);
      });
    });
  }

  $scope.resetMessages = function() {
    $scope.cart.messages = [];
  }

  $scope.resetFailureMessages = function() {
    $scope.cart.failureMessages = [];
  }

  /******************* Events ********************/

  var offAddRule = RuleManager.onAddRule(function (rule) {
    addRuleToCart(rule);
  });

  $scope.$on('$destroy', offAddRule);
})
