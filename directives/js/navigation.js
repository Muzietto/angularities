
var navigationApp = angular.module('navigationSandbox', []);

navigationApp.controller('template1Controller', function($scope){
    $scope.customers = [
      { name: 'Naomi', address: 'casa sua nello attributello' },
      { name: 'Naomi22', address: 'casa sua qqqnello attributello' }
    ]
  })
  .directive('myCustomer', function(){
    return { template: 'Name: {{customer.name}} Address: {{customer.address}}' }
  })

navigationApp.controller('template2Controller', function($scope){
    $scope.countries = {
      AR: {
        mcc: 722,
        pricepoints: [
          {amount:100, credit_providers:[{mnc:310,rid:'mop/AR/Claro'}]},
          {amount:200, credit_providers:[{mnc:311,rid:'mop/AR/Vodafone'}]},
        ]
      },
      MX: {
        mcc: 9222,
        pricepoints: [
          {amount:50, credit_providers:[{mnc:3,rid:'mtp/MX/Vodafone'}]},
        ]
      }
    }
  })
  .directive('myCountry', function(){
    return { }
  })
  .directive('pricepoint', function(){
    return { }
  })
  

navigationApp.controller('template3Controller', function($scope){
    $scope.currentCountry;
    $scope.allerta = function() {alert($scope.currentCountry)};
    
    $scope.countries = {
      AR: {
        name: "Argentina",
        mcc: 722,
        pricepoints: [
          {amount:100, credit_providers:[{mnc:310,rid:'mop/AR/Claro'}]},
          {amount:200, credit_providers:[{mnc:311,rid:'mop/AR/Vodafone'}]},
        ]
      },
      MX: {
        name: "Mexico",
        mcc: 9222,
        pricepoints: [
          {amount:50, credit_providers:[{mnc:3,rid:'mtp/MX/Vodafone'}]},
        ]
      }
    }
  })
  .directive('myCountry', function(/* no globals to use */){
    return {
    /*  link: function(scope, elem, attrs) { // attrs = {myCountry:'countryData'}
        alert(attrs.myCountry)
      }*/
    }
  })
  .directive('pricepoint', function(){
    return { }
  })

/*
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
        customer: '=instance'
      },
      templateUrl: 'html/my-customer.html'
    }
  })
  
directivesApp.controller('docsTimeDirectiveController', function($scope){
    $scope.myDateFormat = 'MM/dd/yy hh:mm:ss Z';
  })
  // we will use the $interval service to call a handler on a regular basis
  // dateFilter is a custom Angular functions (blaaahhh.....)
  .directive('myCurrentTime', function($interval, dateFilter){
//    /* directives that want to modify the DOM typically use the link option. 
       link takes a function with the following signature:
       function link($scope, element, attrs) { ... }
       - element is the jqLite-wrapped element that 
       this directive 'myCurrentTime' matches
       - attrs = {myCurrentTime:'myDateFormat'}
/*
   
   function link($scope, element, attrs){
      var _format, timeoutId
      ;

      function updateTime(){
        element.text(dateFilter(new Date, _format));
      }

      $scope.$watch(attrs.myCurrentTime, function(value){
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
      link: link
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
  */
