
var directivesApp = angular.module('directiveSandbox', ['bkRulesLab']);



directivesApp.controller('docsTemplateUrlDirectiveController', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nello attributello'
    }
  })
  .directive('myCustomer', function(){
    return { templateUrl: 'html/my-customer.html'}
  })

directivesApp.controller('docsRestrictDirectiveController', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nel tag'
    }
  })
  .directive('myCustomerTag', function(){
    return { 
      restrict: 'E',
      templateUrl: 'html/my-customer.html'
    }
  })

directivesApp.controller('docsIsolateScopeDirectiveController', function($scope){
    $scope.naomi = { name: 'Naomi', address: 'casa sua nella var' };
    $scope.igor = { name: 'Igor', address: 'casa mia nella var' };
  })
  .directive('myCustomerTagWithInfo', function(){
    return { 
      restrict: 'E',
      scope: {
        customer: '=' // attribute 'customer' maps to templatevar 'customer'
      },
      templateUrl: 'html/my-customer.html'
/*
<article>
  <p>{{customer.name}}</p>
  <p>{{customer.address}}</p>
<article>
*/      
    }
  })
  
directivesApp.controller('docsTimeDirectiveController', function($scope){
    $scope.myDateFormat = 'MM/dd/yy hh:mm:ss Z';
  })
  // we will use the $interval service to call a handler on a regular basis
  // dateFilter is a custom Angular functions (blaaahhh.....)
  .directive('myCurrentTime', function($interval, dateFilter){
    /* directives that want to modify the DOM typically use the link option. 
       link takes a function with the following signature:
       function link($scope, element, attrs) { ... }
       - element is the jqLite-wrapped element that 
       this directive 'myCurrentTime' matches
       - attrs = {myCurrentTime:'myDateFormat'}
    */
    function linker(scope, element, attrs){
      var _format, timeoutId
      ;

      function updateTime(){
        element.text(dateFilter(new Date, _format));
      }

      scope.$watch(attrs.myCurrentTime, function(value){
        _format = value;
        updateTime();
      });

      element.on('$destroy', function(){
        $interval.cancel(timeoutId);
      });

      // start UI update process; save timeoutId for canceling
      timeoutId = $interval(function(){
        updateTime(); // update DOM
      }, 1000);
    }

    return {
      link: linker
    }
  });

directivesApp.controller('docsTransclusionDirectiveController', function($scope){
    $scope.name = 'Igor';
  })
  .directive('myDialog', function(){
    return { 
      restrict: 'E',
      transclude: true,
      templateUrl: 'html/my-dialog.html'
    }
  })
  
directivesApp.controller('docsIsoFnBindExampleController', function($scope, $timeout){
    $scope.name = 'Luciano';
    $scope.hideDialog = function(){
      $scope.dialogIsHidden = true;
      $timeout(function(){
        $scope.dialogIsHidden = false;
      }, 2000);
    }
  })
  .directive('myDialogWithButtons', function(){
    return { 
      restrict: 'E',
      transclude: true,
      scope: {
        'close': '&onClose'
      },
      templateUrl: 'html/my-dialog-close.html'
    }
  })
  


















