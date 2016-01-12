'use strict';

/* Factories */

angular.module('onebip.panel.bk.factories', [])
.factory('EventHandler', [function () {
  var callbacksCount = 0;

  function EventStore(event, Emitter) {
    var emitter = Emitter;
    var store = {};
    var eventName = event.charAt(0).toUpperCase() + event.substr(1);

    // Add the Event to the Emitter
    Emitter['on' + eventName] = function (cb) {
      var cbNum = ++callbacksCount
      store[cbNum] = cb;
      // The handler can remove itself
      return function () {
        delete store[cbNum];
      };
    };

    // Return a trigger for the Event
    return function () {
      var cbarguments = arguments;
      angular.forEach(store, function (cb) {
        cb.apply(emitter, cbarguments);
      });
    };
  }

  return EventStore;
}])

.factory('ConstraintsTester', ['EventHandler', '$http', '$q', function (EventHandler, $http, $q) {

  var ConstraintsTester = {
    key: null,
    limit: 200,
    offsetEnd: false,
    filters: {},
    offset: 0,
    busy: false,
    rules: [],
    distinctConstraintsKeys: [],
  };

  ConstraintsTester.explain = function (ruleKey, rule) {
    var postData = {};
    for (var key in rule.constraints) {
      // accept strings !== 'any'
      if (angular.isString(rule.constraints[key]) && rule.constraints[key] !== 'any') {
        postData[key] = rule.constraints[key];
      }
      // accept arrays !== ['any']
      if (angular.isArray() && rule.constraints[key][0] !== 'any') {
        postData[key] = rule.constraints[key];
      }
    }
    return $http({
      method: 'GET',
      url: '/api/bk/keys/' + ruleKey + '/explain',
      params: postData
    });
  }

  ConstraintsTester.save = function(constraints, rule, key) {
    return $http({
      method: 'POST',
      url: '/api/bk/testsuite/',
      data: { constraints: constraints, expectedRuleId: rule._id['$id'], key: key}
    });
  }

  return ConstraintsTester;
}])

.factory('ConstraintsFilter', ['EventHandler', '$http', '$q', function (EventHandler, $http, $q) {

  var ready = $q.defer();

  var ConstraintsFilter = {
    key: null,
    limit: 200,
    offsetEnd: false,
    filters: {},
    availableFilters: [],
    offset: 0,
    busy: false,
    keys: [],
    rules: [],
    distinctConstraintsKeys: [],
    isReady: function () { return ready.promise; }
  };

  ConstraintsFilter.loadFilterData = function (key, filterKey) {
    if (!filterKey || !key) return { success: angular.noop };
    return $http({
      method: 'GET',
      url: '/api/bk/keys/' +
        key + '/constraints/' +
        filterKey + '/data',
      params: ConstraintsFilter.filters
    });
  }

  ConstraintsFilter.add = function (key, value) {
    if (!ConstraintsFilter.key || !key) return;
    ConstraintsFilter.filters[key] = value;
    ConstraintsFilter.filter();
  }

  ConstraintsFilter.remove = function (key) {
    delete ConstraintsFilter.filters[key];
    ConstraintsFilter.filter();
  }

  ConstraintsFilter.setCurrentKey = function (key) {
    ConstraintsFilter.filters = {};
    ConstraintsFilter.key = key;
    onChangeKey(key);
    if (!!key) {
      ConstraintsFilter.filter();
    } else {
      ConstraintsFilter.filters = {};
      ConstraintsFilter.availableFilters = [];
      ConstraintsFilter.offset = 0;
      ConstraintsFilter.offsetEnd = false;
      ConstraintsFilter.rules = [];
      ConstraintsFilter.distinctConstraintsKeys = [];
      onLoading(false);
    }
  }

  // TODO: Change it to DRY using unique API
  ConstraintsFilter.filter = function () {
    if (!ConstraintsFilter.key) return;
    onLoading(true);
    ConstraintsFilter.offset = 0;
    ConstraintsFilter.rules.length = 0;
    $http({
      method: 'GET',
      url: '/api/bk/keys/' + ConstraintsFilter.key + '/rules/' + ConstraintsFilter.offset + '/' + ConstraintsFilter.limit,
      params: ConstraintsFilter.filters,
      responseType: 'json'
    })
    .success(function (data) {
      ConstraintsFilter.availableFilters = data.constraintFilters.sort();
      ConstraintsFilter.offset = data.rules.length;
      ConstraintsFilter.offsetEnd = (data.rules.length < ConstraintsFilter.limit);
      ConstraintsFilter.distinctConstraintsKeys = data.constraints.sort();
      ConstraintsFilter.rules = data.rules;
      onFilter(data);
    })
    .finally(function (data) {
      onLoading(false);
    });
  }

  // TODO: Change it to DRY using unique API
  ConstraintsFilter.filterPaginated = function () {
    if (!ConstraintsFilter.key || ConstraintsFilter.busy || ConstraintsFilter.offsetEnd) return;
    onLoading(true);
    $http({
      method: 'GET',
      url: '/api/bk/keys/' + ConstraintsFilter.key + '/rules/' + ConstraintsFilter.offset + '/' + ConstraintsFilter.limit,
      params: ConstraintsFilter.filters,
      responseType: 'json'
    })
    .success(function (data) {
      ConstraintsFilter.offset += data.rules.length;
      ConstraintsFilter.offsetEnd = (data.rules.length < ConstraintsFilter.limit);
      ConstraintsFilter.rules = ConstraintsFilter.rules.concat(data.rules);
      onFilter(data);
    }).finally(function (data) {
      onLoading(false);
    });
  }

  $http.get('/api/bk/keys')
  .then(function (success) {
    ConstraintsFilter.keys = success.data;
    ready.resolve(success);
  }, function (error) {
    ready.reject(error.status);
    // TODO add error message ('Something went wrong while we were trying to load keys', data, status);
  });

  /********************************      Events      */
  var onFilter = new EventHandler('filter', ConstraintsFilter);
  var onChangeKey = new EventHandler('changeKey', ConstraintsFilter);
  var _onLoading = new EventHandler('loading', ConstraintsFilter);
  function onLoading(loading) {
    ConstraintsFilter.busy = loading;
    _onLoading.apply(ConstraintsFilter, arguments);
  }
  /********************************      End Events      */

  return ConstraintsFilter;
}])

.factory('Rule', function (Range, AvailableKeys, constraintMap, Utils) {

  var defaultConstraintValue = 'any';

  function Rule(data, fake) {
    this.priority = 0;
    this.toDelete = false;
    angular.extend(this, data);
    var constraintsKeys = (!!fake) ? [] : Rule.availableConstraintsForRule(data.key);

    // Normalize constraints
    delete this.when;
    var remoteData = (data && data.when) || {};
    var constraints = {};
    angular.forEach(constraintsKeys, function (constraintkey) {
      constraints[constraintkey] = defaultConstraintValue;
      if (constraintkey in remoteData) {
        if (angular.isArray(remoteData[constraintkey])) {
          constraints[constraintkey] = remoteData[constraintkey].join(', ');
        } else {
          constraints[constraintkey] = (angular.isObject(remoteData[constraintkey]))
            ? Range.getRange(remoteData[constraintkey])
            : remoteData[constraintkey];
        }
      }
    });
    this.constraintsKeys = constraintsKeys;
    this.constraints = constraints;
  }

  Rule.prototype.isNew = function () {
    if (this._id && this._id['$id']) {
      return (this._id['$id'].search('new') === 0)
    }

    return false;
  }

  Rule.prototype.markToDelete = function () {
    this.toDelete = true;
  }

  Rule.prototype.isMarkToDelete = function () {
    return !!this.toDelete;
  }

  Rule.prototype.removeMarkToDelete = function () {
    this.toDelete = false;
  }

  // Static methods
  Rule.availableConstraintsForRule = function (key) {
    if (!key || !AvailableKeys[key]) {
      throw 'invalid key';
    }
    return AvailableKeys[key].constraints;
  }

  Rule.Empty = function () {
    var rule = new Rule({}, true);
    rule._id = { $id: 'new' }
    rule.constraintsKeys = Utils.ObjectKeys(constraintMap);
    return rule;
  };

  return Rule;
})

.factory('RuleManager', function (EventHandler, Rule, $http, AvailableKeys) {

  var rulesCounter = 0;
  var getNewId = function () {
    var id = { $id: 'new-' + rulesCounter };
    rulesCounter++;
    return id;
  };

  var parseRule = function (data, isNew) {
    // are we cloning a rule (constraints) or remote data (when) ?
    var rule = (data.hasOwnProperty('constraints'))
      ? angular.copy(data)
      : new Rule(data);

    if (isNew === true) rule._id = getNewId();
    onAddRule(rule);

    return rule;
  }

  var RuleManager = {

    assertAvailableKey: function(key) {
      if (!AvailableKeys[key]) {
        throw "invalid key";
      }
    },

    create: function (key) {
      if (!AvailableKeys[key]) {
        throw "invalid key";
      }

      var result = parseRule({
        key: key,
        value: AvailableKeys[key].default
      }, true);
      return result;
    },

    edit: function (rule) {
      return parseRule(rule);
    },

    remove: function (rule) {
      var newRule = parseRule(rule);
      newRule.markToDelete();

      return newRule;
    },

    clone: function (rule) {
      this.assertAvailableKey(rule.key);

      var newRule = parseRule(rule, true);
      newRule.value = AvailableKeys[rule.key].default;
      newRule.priority = 0;
      newRule.enabled = false;

      return newRule;
    }

  };

  RuleManager.api = {

    create: function (rule, callback) {
      var data = {
        priority: rule.priority,
        enabled: rule.enabled,
        key: rule.key,
        value: rule.value,
        when: {}
      };

      for (var key in rule.constraints) {
        if (rule.constraints[key] &&
           rule.constraints[key] != 'any' &&
           (!angular.isObject(rule.constraints[key]) || angular.toJson(rule.constraints[key]) != '{}')) {
          data.when[key] = rule.constraints[key];
        }
      }
      $http.post('/api/bk/rules', data)
      .then(function (success) {
        var data = success.data;
        onInsert(data);
        callback && callback(true, 'Rule ' + data._id + ' inserted successfully ');
      }, function (error) {
        var data = error.data;
        var status = error.status;
        onError(data, status);
        callback && callback(false, status, data);
      });

      return data;
    },

    update: function (rule, callback) {
      var data = {
        priority: rule.priority,
        enabled: rule.enabled,
        value: rule.value,
      };

      var id = rule._id['$id'];
      $http.put('/api/bk/rules/' + id, data)
      .then(function (success) {
        var id = success.config.url.split('/').slice(-1)[0];
        var data = success.data;
        onUpdate(id, data);
        callback && callback(true, 'Rule ' + id + ' updated successfully ');
      }, function (error) {
        var data = error.data;
        var status = error.status;
        onError(data, status);
        callback && callback(false, status, data);
      });
    },

    remove: function (rule, callback) {
      var id = rule._id['$id'];
      $http.delete('/api/bk/rules/' + id)
      .then(function (success) {
        var id = success.config.url.split('/').slice(-1)[0];
        var data = success.data;
        onDelete(id, data);
        callback && callback(true, 'Rule ' + id + ' removed successfully ');
      }, function (error) {
        var data = { error: error.statusText };
        var status = error.status;
        onError(data, status);
        callback && callback(false, status, data);
      });
    },

    save: function (rule, callback) {
      if (rule.isNew()) {
        return RuleManager.api.create(rule, callback);
      } else if (rule.isMarkToDelete()) {
        return RuleManager.api.remove(rule, callback);
      } else {
        return RuleManager.api.update(rule, callback);
      }
    }
  };

  /********************************      Events           ********************************/
  var onInsert = new EventHandler('insert', RuleManager);
  var onUpdate = new EventHandler('update', RuleManager);
  var onDelete = new EventHandler('delete', RuleManager);
  var onError = new EventHandler('error', RuleManager);
  var onAddRule = new EventHandler('addRule', RuleManager);
  /********************************      End Events      ********************************/

  return RuleManager;
})

.factory('ClipBoard', function (AvailableKeys) {

  var clipboard = {
    constraints: {

      _readyCBcount: 0,
      _readyCBs: {},
      _value: {},

      isPasteReady: false,

      onClipboardChange: function (cb) {
        clipboard.constraints._readyCBs[++clipboard.constraints._readyCBcount] = cb;
        return clipboard.constraints._readyCBcount;
      },
      removeClipboardChange: function (readyCBcount) {
        delete clipboard.constraints._readyCBs[readyCBcount];
      },
      copy: function (sourceConstraints) {
        clipboard.constraints._value = JSON.stringify(sourceConstraints);
        clipboard.constraints.isPasteReady = true;
        angular.forEach(clipboard.constraints._readyCBs, function (cb) { cb(); });
      },
      paste: function (destConstraints) {
        var _value = JSON.parse(clipboard.constraints._value);
        angular.forEach(_value, function (cValue, cKey) {
          if (destConstraints.hasOwnProperty(cKey)) {
            destConstraints[cKey] = cValue;
          }
        });
        return destConstraints;
      }
    }
  }
  return clipboard;
});
