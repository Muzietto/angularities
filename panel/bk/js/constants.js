'use strict';

/* Constants */

angular.module('onebip.panel.bk.constants', [])
.service('AvailableKeysService', function(AvailableKeys) {
    this.render = function(rule, constraint) {

      if(AvailableKeys[rule.key] && AvailableKeys[rule.key].render && AvailableKeys[rule.key].render[constraint]) {
        var options = AvailableKeys[rule.key].options?AvailableKeys[rule.key].options: {};
        return AvailableKeys[rule.key].render[constraint](rule, constraint, options);
      }

      return ((rule[constraint] !== undefined) ? rule[constraint] : '');
    }
})
.constant('OperatorsMaps', {
  'gt-amount': '>',
  'lt-amount': '<',
  'lte-amount': '≤',
  'gte-amount': '≥',
  'ne-amount': '≠',
  'neq': '≠'
})
.constant('AvailableKeys', {
  'COMMISSIONBASE': {
    type: 'select',
    default: '',
    constraints: ['country', 'merchant', 'amount', 'container_kind'],
    options: ['NETPAYOUTAPPLIED', 'GROSSAMOUNTAPPLIED'],
    identifier: 'COMMISSIONBASE'
  },
  'RECEIVEMONEY': {
    type: 'array',
    default: [0, '%'],
    constraints: ['country', 'merchant', 'credit_provider', 'payment_volume', 'amount', 'container_kind'],
    identifier: 'RECEIVEMONEY',
    render: {
      value: function(rule, constraint) {
        return rule[constraint].join('');
      }
    }
  },
  'WITHDRAWMONEY': {
    type: 'array',
    default: [0, '%'],
    constraints: ['country', 'merchant', 'credit_provider', 'amount', 'container_kind'],
    identifier: 'WITHDRAWMONEY',
    render: {
      value: function(rule, constraint) {
        return rule[constraint].join('');
      }
    }
  },
  'MERCHANT_REVENUE_SHARE': {
    type: 'revenue',
    default: {'revenue-share': [0, '%'], 'applied-to': null},
    constraints: [
      'payment_method',
      'country',
      'credit_provider',
      'merchant',
      'payment_volume',
      'amount',
      'container_amount',
      'connectivity',
      'route',
      'container_kind',
      'business_model',
      'service',
      'category',
      'context'
    ],
    options: {
      'gross-transaction-value': 'GTV',
      'gross-transaction-value-vat-excluded': 'GTV vat. ex.',
      'net-revenue': 'Net revenue'
    },
    identifier: 'MERCHANT_REVENUE_SHARE',
    suffix: '%',
    render: {
      value: function(rule, constraint, options) {
        var output = rule[constraint]["revenue-share"].join('');

        if(options[rule[constraint]["applied-to"]]){
          output += ' applied to '+ options[rule[constraint]["applied-to"]];
        }
        return output;
      }
    }
  },
  'ONEBIP_REVENUE_SHARE': {
    type: 'revenue',
    default: {'revenue-share': [0, '%'], 'applied-to': null},
    constraints: [
      'payment_method',
      'country',
      'credit_provider',
      'merchant',
      'payment_volume',
      'amount',
      'connectivity',
      'route',
      'container_kind',
      'business_model',
      'service',
      'category',
      'context'
    ],
    options: {
      'gross-transaction-value': 'GTV',
      'gross-transaction-value-vat-excluded': 'GTV vat. ex.'
    },
    identifier: 'ONEBIP_REVENUE_SHARE',
    suffix: '%',
    render: {
      value: function(rule, constraint, options) {
        var output = rule[constraint]["revenue-share"].join('');

        if(options[rule[constraint]["applied-to"]]){
          output += ' applied to '+ options[rule[constraint]["applied-to"]];
        }
        return output;
      }
    }
  }
})
.constant('constraintMap', {
  country: 'Country',
  merchant: 'Merchant',
  credit_provider: 'Credit provider',
  payment_volume: 'Payment volume',
  amount: 'Amount',
  container_kind: 'Container Kind',
  route: 'Route',
  connectivity: 'Connectivity',
  context: 'Context',
  service: 'Service',
  category: 'Category',
  business_model: 'Business model',
  container_amount: 'Container amount',
  payment_method: 'Payment method'
})
.constant('constraintsMap', [
  {
    name: 'payment_method',
    plural: 'payment_methods',
    label: 'Payment method',
    order: 0
  },
  {
    name: 'country',
    plural: 'countries',
    label: 'Country',
    order: 1
  },
  {
    name: 'credit_provider',
    plural: 'credit_providers',
    label: 'Credit provider',
    order: 2
  },
  {
    name: 'merchant',
    plural: 'merchants',
    label: 'Merchant',
    order: 3
  },
  {
    name: 'payment_volume_puntual',
    plural: 'payment_volumes',
    label: 'Payment volume',
    order: 4
  },
  {
    name: 'amount',
    plural: 'amounts',
    label: 'Amount',
    order: 5
  },
  {
    name: 'container_amount',
    plural: 'container_amounts',
    label: 'Container amount',
    order: 6
  },
  {
    name: 'connectivity',
    plural: 'connectivities',
    label: 'Connectivity',
    order: 7
  },
  {
    name: 'route',
    plural: 'routes',
    label: 'Route',
    order: 8
  },
  {
    name: 'container_kind',
    plural: 'container_kinds',
    label: 'Container Kind',
    order: 9
  },
  {
    name: 'business_model',
    plural: 'business_models',
    label: 'Business model',
    order: 10
  },
  {
    name: 'service',
    plural: 'services',
    label: 'Service',
    order: 11
  },
  {
    name: 'category',
    plural: 'categories',
    label: 'Category',
    order: 12
  },
  {
    name: 'context',
    plural: 'contexts',
    label: 'Context',
    order: 13
  }
]);
