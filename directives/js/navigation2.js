var navigationApp = angular.module('navigationSandbox', []);

var directiveFrom = function(templateName,varName){
  return function($templateCache){
    return {
      restrict: 'E',
      template: $templateCache.get(templateName),
      transclude: true,
      link: function(scope,element,attrs){
        scope.$watch(attrs[varName],function(value){
          if (!value) return;
          repaint();
        });
        function repaint(){
          element.html(template);
          $compile(element.contents())(scope);
        }
      }
    }
  }
}

navigationApp.controller('template3Controller', function($scope){
    $scope.oneAtATime = true;
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    $scope.currentCountry = null;
    $scope.currentPrice = null;
    $scope.currentConnectivity = null;
    $scope.currentCreditProvider = null;
    $scope.countries = blob.countries;
  })
  .directive('countryData',directiveFrom('country.tmpl','name'))
  .directive('priceData',directiveFrom('price.tmpl','amount'))
  .directive('connectivityData',directiveFrom('connectivity.tmpl','rid'))
  .directive('creditProviderData',directiveFrom('creditProvider.tmpl','rid'))

var blob = {
    "countries": [
        {
            "accordionCode": "One", 
            "mcc": "269", 
            "name": "Rangiroa", 
            "prices": [
                {
                    "amount": "0.0000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobileviewpt"
                        }, 
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "2.1000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }
            ]
        },
        {
            "mcc": "268", 
            "accordionCode": "Two", 
            "name": "Portugal", 
            "prices": [
                {
                    "amount": "0.0000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobileviewpt"
                        }, 
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MT"
                                        }, 
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MT"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "2.1000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68636", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "2.4600", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68999", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobileviewpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "3.0000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68637", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "4.0000", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68638", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobiletrendpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }, 
                {
                    "amount": "6.1500", 
                    "connectivities": [
                        {
                            "credit_providers": [
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "06", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/TMN", 
                                    "routes": [
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "01", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Vodafone", 
                                    "routes": [
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }, 
                                {
                                    "daily_spending_limit": 50, 
                                    "mnc": "03", 
                                    "monthly_spending_limit": 300, 
                                    "rid": "mop/PT/Optimus", 
                                    "routes": [
                                        {
                                            "lane": "68985", 
                                            "type_of_billing": "MO"
                                        }
                                    ]
                                }
                            ], 
                            "rid": "Mobileviewpt"
                        }
                    ], 
                    "currency": "EUR", 
                    "type": "point"
                }
            ], 
            "rid": "PT"
        }
    ]
}