'use strict';

angular.module('onebip.panel.bk.directives', [])

.directive('constraintInput', function ($http, $compile, Range) {
  var admittedInput = [
    'country',
    'credit_provider',
    'merchant',
    'amount',
    'container_kind',
    'payment_volume',
    'payment_volume_puntual',
    'payment_method',
  ];
  return {
    scope: {
      name: '@',
      rule: '=',
      multiple: '=',
      api: '@',
    },
    controller: function ($scope, $attrs) {
      $scope.items = [];
      $scope.config = { minimumInputLength: 2 };
      if ($attrs.hasOwnProperty('simulator')) {
        $scope.simulator = true;
      }
    },
    priority: -1,
    restrict: 'E',
    link: function (scope, element, attrs) {

      var name = scope.name;
      var defaultValue = 'any';
      var constraintElement;

      if(!attrs.api) {
        throw 'Api url is not defined';
      }

      if(!attrs.hasOwnProperty('defaultValue')) {
        throw 'Default value is not defined';
      }

      if (attrs.defaultValue || attrs.defaultValue === "") {
        defaultValue = attrs.defaultValue;
      }

      if (!name || !isAdmitted(name)) {
        name = 'default';
      }

      if (scope.rule && scope.rule.isNew()) {
        constraintElement = "<constraint-" + name +
          ((attrs.hasOwnProperty('freeEdit')) ? ' free-edit' : '') +
          ((attrs.hasOwnProperty('simulator')) ? ' simulator' : '') +
          ((attrs.hasOwnProperty('multiple')) ? ' multiple' : '') +
          ((attrs.hasOwnProperty('api')) ? ' api="' + attrs.api  + '"' : '') +
          ((attrs.hasOwnProperty('anyValueOnSelect')) ? ' any-value-on-select' : '') +
          " name=" + scope.name +
          " default-value=" + defaultValue  + "/>";
      } else {
        var staticValue = '';
        if (scope.rule && scope.rule.constraints && scope.rule.constraints[scope.name]) {
          staticValue = scope.rule.constraints[scope.name];
          if (Range.isRange(staticValue)) {
            staticValue = Range.toString(staticValue);
          }
        }
        constraintElement = '<p class="form-control-static">' + staticValue + '</p>';
      }
      element.append($compile(constraintElement)(scope));
    }
  }

  function isAdmitted(value) { 
    return (admittedInput.indexOf(value) >= 0); 
  };
})
.directive('constraintDefault', function ($http) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
      if ($attrs.hasOwnProperty('simulator')) {
        $scope.simulator = true;
      }
      var name = $attrs.name;
      $scope.anyValueOnSelect = $attrs.hasOwnProperty('anyValueOnSelect');
      $scope.itemLoading = true;
      $scope.input = false;
      $scope.rule.constraints[name] = $scope.rule.constraints[name] || [$attrs.defaultValue];
      $http.get("/api/" + $scope.api + "/"   + $scope.name, { cache: true })
        .success(function (data) {
          $scope.items = data.elements;
        })
        .error(function(){
          $http.get("/api/reports/payment/filter/" + $scope.name, {cache: true})
            .success(function(data){
              angular.forEach(data, function(value, key){
                $scope.items.push({rid: key, name: value});
              });
            })
            .error(function(){
              //todo show input if ajax fail
              $scope.input = true;
            })
            .finally(function () { $scope.itemLoading = false; })
        })
        .finally(function () { $scope.itemLoading = false; });
    },
    templateUrl: '/lib/bk/views/constraint/select.html',
    link: function(scope, elem, attrs) {
      var constraintName = scope.name;
      if (scope.simulator && angular.isArray(scope.rule.constraints[constraintName]) && scope.rule.constraints[constraintName][0] === 'any') {
        // ['any'] --> 'any'
       scope.rule.constraints[constraintName] = 'any'; 
      }
      if (typeof attrs.multiple !== 'undefined') {
        elem.children().attr("multiple", "multiple");
      }
    }
  }
})
.directive('constraintCountry', function ($http) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
      $scope.anyValueOnSelect = $attrs.hasOwnProperty('anyValueOnSelect');
      $scope.itemLoading = true;
      $scope.rule.constraints.country = $scope.rule.constraints.country || $attrs.defaultValue;
      $http.get("/api/" + $scope.api + "/countries", { cache: true })
        .success(function (data) {
          $scope.items = data.elements;
        })
        .finally(function () {
          $scope.itemLoading = false;
        });
    },
    templateUrl: '/lib/bk/views/constraint/select.html',
    link: function(scope, elem, attrs) {
      if (typeof attrs.multiple !== 'undefined') {
        elem.children().attr("multiple", "multiple");
      }
    }
  }
})
.directive('constraintCreditProvider', function ($http) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
      $scope.disabled = true;
      $scope.items = [{ rid: 'any', name: 'any' }];
      $scope.rule.constraints.credit_provider = $scope.rule.constraints.credit_provider || $attrs.defaultValue;
      $scope.isFreeEdit = $attrs.hasOwnProperty('freeEdit');
    },
    link: function (scope, elem, attrs) {
      scope.anyValueOnSelect = attrs.hasOwnProperty('anyValueOnSelect');

      if (typeof attrs.multiple !== 'undefined') {
        elem.children().attr("multiple", "multiple");
      }

      var wasGlobalCountry = false,
          anyCountry,
          globalCountry,
          globalCountryMap = function (item) { return { rid: item.rid, name: item.rid }};

      scope.$watch('rule.constraints.country', function (newCountry) {
        anyCountry = !newCountry || newCountry === 'any';
        globalCountry = scope.isFreeEdit && anyCountry;

        if ((!wasGlobalCountry && globalCountry) || !anyCountry) {
          scope.itemLoading = true;
          $http.get('/api/' + scope.api + '/credit-providers?query=' + ((!globalCountry) ? newCountry : ''))
          .success(function (data) {
            scope.items = data.elements.map(globalCountryMap);

            if(scope.anyValueOnSelect) {
              scope.items.unshift({ rid: 'any', name: 'any' });  
            }
          })
          .finally(function () {
            scope.disabled = scope.itemLoading = false;
          });
        } else if (!wasGlobalCountry) {
          scope.items = [{ rid: 'any', name: 'any' }];
          scope.disabled = true;
        }
        wasGlobalCountry = globalCountry;

      }, true);
    },
    templateUrl: '/lib/bk/views/constraint/credit_provider.html'
  }
})
.directive('constraintMerchant', function (Select2Helper, Session) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/lib/bk/views/constraint/select_ajax.html',
    controller: function ($scope, $attrs) {
      var elementVal;

      if ($attrs.defaultValue || $attrs.defaultValue !== "") {
        $scope.rule.constraints.merchant = $scope.rule.constraints.merchant || $attrs.defaultValue;
      } else {
        $scope.rule.constraints.merchant = [];
      }
      
      $scope.config = {
        minimumInputLength: 3,
        ajax: {
          params: { headers: { "X-Onebip-Authentication": Session.getToken() } },
          url: "/api/" + $scope.api + "/merchants",
          data: function (term) {
            return { query: term };
          },
          results: function (data) {
            return {
              results: data.elements.map(function (item) {
                return { id: item.rid, text: item.rid }
              })
            };
          }
        },
        initSelection: function (element, callback) {
          if (!element || !(elementVal = element.val())) return;
          callback({ id: elementVal, text: elementVal });
        },
      };

      if($attrs.hasOwnProperty('multiple')) {
        $scope.config.simple_tags = true;
      }

      if ($attrs.hasOwnProperty('freeEdit')) {
        $scope.config.createSearchChoice = function (term, data) {
          return { id: term, text: term, custom: true };
        };
        $scope.config.formatResult = Select2Helper.formatCustomIcon;
        $scope.config.formatSelection = Select2Helper.clearSelection;
        $scope.config.escapeMarkup = Select2Helper.dontEscapeMarkup;
      }
    }
  }
})
.directive('constraintAmount', function ($http, Numeral, Select2Helper, Range) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/lib/bk/views/constraint/amount.html',
    require: 'constraintAmount',
    controller: function ($scope, $attrs) {
      var ctrl = this;
      ctrl.currency = false;
      $scope.disabled = $scope.itemLoading = false;
      $scope.type = (Range.isRange($scope.rule.constraints.amount)) ? 'range' : 'punctual';

      if (!$scope.rule.constraints.amount) {
        $scope.rule.constraints.amount = 'any';
      } else if (angular.isString($scope.rule.constraints.amount) && $scope.rule.constraints.amount.match(/ and /g)) {
        $scope.type = 'range';
        $scope.rule.constraints.amount = Range.fromString($scope.rule.constraints.amount);
      }

      if ($attrs.hasOwnProperty('freeEdit')) {
        $scope.config.createSearchChoice = function (term, data) {
          if (ctrl.currency && !isNaN(term)) {
            var postFix = Numeral(Numeral().unformat(term)).format() + ctrl.currency;
            data.unshift({ id: postFix, text: postFix, custom: true });
          }
          return { id: term, text: term, custom: true };
        };
        $scope.config.formatResult = Select2Helper.formatCustomIcon;
        $scope.config.formatSelection = Select2Helper.clearSelection;
        $scope.config.escapeMarkup = Select2Helper.dontEscapeMarkup;
      }

      $scope.selectConfig = {
        create: true,
        valueField: 'id',
        labelField: 'text',
        delimiter: '|',
        placeholder: 'Pick a pricepoint',
        onInitialize: function(selectize) {
        }
      };

      if ($attrs.hasOwnProperty('simulator')) {
        $scope.selectConfig.maxItems = 1;
        $scope.simulator = true;
      }
    },
    link: function (scope, element, attrs, ctrl) {
      scope.$watch('rule.constraints.amount', function (newAmount, oldAmount) {
        var type = (scope.simulator) ? 'punctual' : (Range.isRange(newAmount) ? 'range' : 'punctual');
        if (scope.type != type) {
          scope.type = type;
        }

        if (angular.isArray(newAmount)) {
          if (newAmount.length > 1) {
            angular.copy(
              newAmount.filter(function (item) { return 'any' !== item; }),
              scope.rule.constraints.amount
            );
          }

          if (scope.rule.constraints.amount.length === 0) {
            scope.rule.constraints.amount.push('any');
          }
        }
      });

      scope.$watch('rule.constraints.country', function (newCountry) {
        if (newCountry !== 'any' && !!newCountry) {
          scope.disabled = scope.itemLoading = true;
          $http.get('/api/bk/constraints/amounts?country=' + newCountry)
            .success(function (data) {
              scope.options = [];
              var currency; ctrl.currency = '';
              if (data.elements
                && data.elements.length > 0
                && data.elements[0]
                && (currency = data.elements[0].rid.match(/\/[a-z]+/i)[0])) {
                ctrl.currency = currency;
              }
              data.elements.unshift({ rid: 'any' });

              scope.options = data.elements.map(function (item) {
                return { id: item.rid, text: item.rid }
              });
            })
            .finally(function () {
              scope.disabled = scope.itemLoading = false;
            });
        } else {
          if (scope.type === 'punctual') {
            scope.rule.constraints.amount = 'any';
          }
          scope.options = [{ id: 'any', text: 'any' }];
          scope.disabled = !attrs.hasOwnProperty('freeEdit');
        }
      }, true);
    }
  }
})
.directive('constraintContainerKind', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
      $scope.anyValueOnSelect = $attrs.hasOwnProperty('anyValueOnSelect');
      $scope.rule.constraints.container_kind = $scope.rule.constraints.container_kind || 'any';
      $scope.items = [{ rid: 'purchase' }, { rid: 'subscription' }]
    },
    templateUrl: '/lib/bk/views/constraint/select.html'
  }
})
.directive('constraintPaymentMethod', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope, $attrs) {
      $scope.anyValueOnSelect = $attrs.hasOwnProperty('anyValueOnSelect');
      $scope.rule.constraints.payment_method = $scope.rule.constraints.payment_method || 'any';
      $scope.items = [{ rid: 'msisdn' }, { rid: 'line' }]
    },
    templateUrl: '/lib/bk/views/constraint/select.html'
  }
})
.directive('constraintPaymentVolume', function (Range) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope) {
      if (angular.isString($scope.rule.constraints.payment_volume)) {
        $scope.rule.constraints.payment_volume = Range.fromString($scope.rule.constraints.payment_volume);
      }
    },
    templateUrl: '/lib/bk/views/constraint/payment_volume.html'
  }
})
.directive('constraintPaymentVolumePuntual', function (Range) {
  return {
    restrict: 'E',
    replace: true,
    controller: function($scope, $attrs) {
      if ($attrs.hasOwnProperty('simulator')) {
        $scope.simulator = true;
      }
    },
    templateUrl: '/lib/bk/views/constraint/payment_volume_puntual.html'
  }
})
.directive('bkTooltip', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      if (!attrs.hasOwnProperty('bkTooltip')) return;
      var options = {
        'title': attrs.bkTooltip,
        'placement': attrs.placement || 'bottom'
      }

      var attrOptions;
      if (attrs.hasOwnProperty('bkTooltipOptions')
        && angular.isObject((attrOptions = scope.$eval(attrs.bkTooltipOptions)))) {
        angular.extend(options, attrOptions);
      }

      angular.isFunction(element.tooltip) && element.tooltip(options);
    }
  }
})
.directive('bkSlider', ['$q', function ($q) {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    priority: 1,
    template:
      '<div class="jslider-container">' +
        '<div class="jslider-wrapper">' +
          '<div class="jslider-label jslider-label-from"><span class="jslider-from"></span><span class="jslider-label-dimension"></span></div>' +
          '<div class="jslider-label jslider-label-to"><span class="jslider-to"></span><span class="jslider-label-dimension"></span></div>' +
        '</div>' +
        '<div class="jslider-pointer"></div>' +
        '<div class="jslider-pointer jslider-pointer-to"></div>' +
        '<div class="jslider-value"><span></span><i class="jslider-label-dimension"></i></div>' +
        '<div class="jslider-value jslider-value-to"><span></span><i class="jslider-label-dimension"></i></div>' +
        '<div class="jslider-scale"></div>' +
      '</div>',
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return;

      var slider, OPTIONS;
      var defer = $q.defer();
      var ready = defer.promise;
      var options = scope.$eval(attrs.options);
      var scale = element.find(".jslider-scale");
      var dimension = element.find(".jslider-label-dimension");
      var color = attrs.bgColor || options.bgColor || false;
      var useLimits = options.hasOwnProperty('skipLimits') && !options.skipLimits;

      if (!!color) element.find(".jslider-wrapper").css('background-color', color);
      element.addClass('jslider');

      ngModel.$render = function () {
        ready.then(function () {
          update(ngModel.$viewValue || '0');
        });
      };

      var init = function (startValue) {

        if (typeof (startValue) === 'number') {
          startValue = '' + startValue;
        }

        if (!startValue.split(";")[1])
          element.addClass('jslider-single');

        if (useLimits) {
          var from = element.find(".jslider-from");
          var to = element.find(".jslider-to");
          from.html('' + options.from);
          to.html('' + options.to);
        }

        if (options.dimension)
          dimension.html('' + options.dimension);

        OPTIONS = {
          from: options.from,
          to: options.to,
          step: options.step,
          stepClick: options.stepClick,
          skipLabels: options.skipLabels || true,
          skipLimits: !useLimits,
          smooth: options.smooth || true,
          round: options.round || false,
          scale: options.scale,
          value: startValue,
          limits: useLimits,
          dimension: "",
          sliderSpan: element,
          callback: function (value) {
            scope.$apply(function () {
              ngModel.$setViewValue(value);
            });
          },
          onready: function (s) {
            slider = s;
            defer.resolve(s);
          }
        };

        if (options.calculate)
          OPTIONS.calculate = options.calculate;

        element.slider(OPTIONS);

        ready.then(function (s) {
          scale.html(generateScale());
          drawScale();
        });
      };

      var update = function (value) {
        if (typeof (value) === 'number') {
          value = '' + value;
        }

        var pointers = slider.getPointers();
        if (pointers.length < 1) return;
        var prc = slider.valueToPrc(value, pointers[0]);
        pointers[0].set(value);
      };

      var generateScale = function () {
        if (options.scale && options.scale.length > 0) {
          var str = "";
          var s = options.scale;
          var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
          for (var i = 0; i < s.length; i++) {
            str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '') + '</span>';
          }
          return str;
        }
        return '';
      };

      var drawScale = function () {
        element.find(".jslider-scale span ins").each(function () {
          $(this).css({ marginLeft: -$(this).outerWidth() / 2 });
        });
      };

      init(ngModel.$viewValue || '0');
    }
  }
}])

.directive('ruleValue', function ($compile, AvailableKeys) {
  return {
    restrict: 'E',
    link: function link(scope, element, attributes) {
      var elToCompile;

      if (scope.rule && AvailableKeys[scope.rule.key] && AvailableKeys[scope.rule.key].type) {
        switch (AvailableKeys[scope.rule.key].type) {
          case 'select':
            scope.options = AvailableKeys[scope.rule.key].options;
            elToCompile = '<select data-bk-tooltip="Select a valid option" class="form-control" ng-model="rule.value" ng-options="option for option in options" />';
            break;
          case 'array':
            elToCompile = '<input data-bk-tooltip="Percentage value. Format example: 50.5" class="form-control" type="input" ng-model="rule.value[0]" />';
            break;
          case 'revenue':
            scope.options = AvailableKeys[scope.rule.key].options;
            elToCompile = '<div class="input-group"><input data-bk-tooltip="Percentage value. Format example: 50.5" class="form-control" type="input" ng-model=\'rule.value["revenue-share"][0]\' /><span class="input-group-addon">%</span></div>';
            elToCompile += '<div class="form-group"><label style="margin-top: 5px;">Applied to</label>'
            elToCompile += '<select data-bk-tooltip="Select a valid option" class="form-control" ng-model=\'rule.value["applied-to"]\' ng-options="key as value for (key, value) in options" /></div>';
            break;
        }

        element.append($compile(elToCompile)(scope))
      }
    }
  };
})
.directive('ruleTableDrag', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      if (element.length < 1) throw ('TBody is missing rows');

      var ol = element[0];

      if (attrs.hasOwnProperty('ruleTableReorder')) {
        var getterReorder = $parse(attrs.ruleTableReorder), reorderFn = getterReorder(scope);

        ol.addEventListener('slip:beforereorder', function (e) {
          if (/swipe/.test(e.target.className)) { e.preventDefault(); return false; }
          return true;
        }, false);

        ol.addEventListener('slip:beforewait', function (e) {
          if (!(/swipe/.test(e.target.className))) { e.preventDefault(); return false; }
          return true;
        }, false);

        ol.addEventListener('slip:reorder', reorderFn, false);
      }

      if (attrs.hasOwnProperty('ruleTableSwiper')) {
        var getterSwiper = $parse(attrs.ruleTableSwiper), swiperFn = getterSwiper(scope);
        ol.addEventListener('slip:swipe', swiperFn, false);
      }

      var slip = new Slip(ol, { maxRightSwipe: 70, maxLeftSwipe: 0, swipeWithDistance: 71 });
    }
  }
})
.directive('ruleTable', function () {
  return {
    restrict: 'A',
    controller: function ($scope, $attrs) {

      if (!$attrs.hasOwnProperty('constraintsKeys'))
        throw ('Rule Table is missing constraintsKeys param');

      this.constraintsKeys = $scope.$eval($attrs.constraintsKeys) || [];
      this.security = $scope.$eval($attrs.ruleSecurity);
      this.extraColumns = $attrs.hasOwnProperty('constraintsColumns') ? $attrs.constraintsColumns.split(',') : [];
      this.extraHeaders = $attrs.hasOwnProperty('constraintsHeaders') ? $attrs.constraintsHeaders.split(',') : [];
    }
  }
})
.directive('ruleRow', function (Range, AvailableKeysService) {
  return {
    restrict: 'A',
    require: '^ruleTable',
    controller: function ($scope, $attrs) {
      if ($attrs.hasOwnProperty('simulator')) {
        $scope.simulator = true;
      }
    },
    link: function (scope, element, attrs, tableCtrl) {
      if (!attrs.hasOwnProperty('rule')) {
        throw ('Rule is missing a mandatory parameter: rule');
      }

      var keys = tableCtrl.constraintsKeys;
      var extraColumns = tableCtrl.extraColumns;
      var rule = scope.$eval(attrs.rule);
      var elements = [];

      if (!scope.simulator) {
        angular.forEach(keys, function (key) {
          var result;
          var constraintkey = (rule.when && rule.when[key]) || 'any';
          if (angular.isArray(constraintkey)) {
            constraintkey = constraintkey.join(',<br/>');
          } else if (angular.isObject(constraintkey)) {
            // special handling for payment_volume data
            // { gt:300 } --> { from : { operator: 'gt-amount', value: 300}}
            // { lte:500 } --> { to : { operator: 'lte-amount', value: 500}}
            if (key === 'payment_volume') { // 
              result = { from: {}, to: {} };
              if (constraintkey.gt) {
                result.from.operator = 'gt-amount';
                result.from.value = constraintkey.gt;
              }
              if (constraintkey.gte) {
                result.from.operator = 'gte-amount';
                result.from.value = constraintkey.gte;
              }
              if (constraintkey.lt) {
                result.to.operator = 'lt-amount';
                result.to.value = constraintkey.lt;
              }
              if (constraintkey.lte) {
                result.to.operator = 'lte-amount';
                result.to.value = constraintkey.lte;
              }
            } else { // key in ['amount', 'merchant', what_else?]
              result = constraintkey;
            }
            /* NB - if next invocation produces wrong results,
             * verify that OperatorsMaps in constants.js contains
             * the character needed for the specific decoding */
            constraintkey = Range.toString(result);
          }
          elements.push('<td>' + constraintkey + '</td>');
        });
      }

      angular.forEach(extraColumns, function (key) {
        elements.push('<td>' + render(rule, key) + '</td>');
      });

      if (scope.simulator) {
        elements.push('<td>' + rule._id.$id + '</td>');
        elements.push('<td>' + rule.priority + '</td>');
      }

      element.append.apply(element, elements);
    }
  }
  function render(rule, constraint) {
    return AvailableKeysService.render(rule, constraint);
  }
})
.directive('ruleHeaders', function (string) {
  return {
    restrict: 'A',
    require: '^ruleTable',
    controller: function ($scope, $attrs) {
      if ($attrs.hasOwnProperty('simulator')) {
        $scope.simulator = true;
      }
    },
    link: function (scope, element, attrs, tableCtrl, transclude) {

      var keys = tableCtrl.constraintsKeys;
      var extraHeaders = tableCtrl.extraHeaders;
      var elements;

      if (!scope.simulator) {
        angular.forEach(keys, function (key) {
          var constraintkey = string(key).humanize().capitalize().toString();
          elements += '<th>' + constraintkey + '</th>';
        });
      }

      angular.forEach(extraHeaders, function (key) {
        elements += '<th>' + key + '</th>';
      });
      element.append(elements);
    }
  }
})
.directive('ruleEditableTd', function (Security) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var rule;
      if (!attrs.hasOwnProperty('ruleEditableTd')
        || !(rule = scope.$eval(attrs.ruleEditableTd))
        || !Security.canEditKey(rule.key)) {
        element.html('-');
      }
    }
  }
})

.directive('clipboardConstraintCopy', function (Security, ClipBoard) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var rule;
      if (!attrs.hasOwnProperty('clipboardConstraintCopy')
        || !(rule = scope.$eval(attrs.clipboardConstraintCopy))
        || !rule.key
        || !Security.canEditKey(rule.key)) {
        element.addClass('disabled');
        return;
      }

      element.bind('click', function (e) {
        if (!rule.constraints) return;
        ClipBoard.constraints.copy(rule.constraints);
      });
    }
  }
})
.directive('clipboardConstraintPaste', function (Security, ClipBoard) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var rule;
      if (!attrs.hasOwnProperty('clipboardConstraintPaste')
        || !(rule = scope.$eval(attrs.clipboardConstraintPaste))
        || !rule.key
        || !rule.isNew()
        || !Security.canEditKey(rule.key)) {
        element.addClass('disabled');
        return;
      }

      if (!ClipBoard.constraints.isPasteReady) element.addClass('disabled')

      var cb = ClipBoard.constraints.onClipboardChange(function () {
        element.removeClass('disabled');
      });

      element.bind('click', function (e) {
        if (!rule.constraints || !ClipBoard.constraints.isPasteReady) return;
        ClipBoard.constraints.paste(rule.constraints);
      });

      element.on('$destroy', function (e) {
        ClipBoard.constraints.removeClipboardChange(cb);
      });
    }
  }
})

.directive('threeLoader', function (ConstraintsFilter) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div><i></i><i></i><i></i></div>',
    link: function (scope, element, attrs) {
      var remover = ConstraintsFilter.onLoading(function (loading) {
        if (loading) {
          element.addClass('threeloading');
        } else {
          element.removeClass('threeloading');
        }
      });

      
    }
  }
})
.directive('sideLoader', function ($timeout) {
  var loadingClasses = 'fa fa-refresh fa-spin';
  return {
    restrict: 'E',
    replace: true,
    template: '<i class="sideloader"></i>',
    link: function (scope, element, attrs) {

      if (!attrs.hasOwnProperty('spinOn')) return;
      scope.$watch(attrs.spinOn, function (loading) {
        if (!!loading) {
          element.addClass(loadingClasses);
        } else {
          element.removeClass(loadingClasses);
        }
      });

    }
  }
})
.directive('preventDefault', function ($timeout) {
  return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      element.on('click', function(e){
        e.preventDefault();
      });
    }
  }
})
;
