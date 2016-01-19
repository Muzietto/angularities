'use strict';

angular.module('onebip.panel.dashboard.services', [])
.service('DashboardDataService', ['$http', 'DashboardFilterService', function($http,DashboardFilterService){
  var service = this;
  var filter = DashboardFilterService;

  this.countries = {}; // will be filled through ajax calls

  this.getCountryData = function(countryCode,cb) {

    $http.get('/app/panel/dashboard/configuration/country/' + countryCode + '.json')
    .success(function(data){
      var pdata = preprocessCountryData(data);
      service.countries[countryCode] = pdata;
      if (cb) cb();
    });
  }

  function preprocessCountryData(countryData){

    // provide additional field for country itself
    countryData.filtered = false;
    if (!countryData.prices) return countryData;

    // sometimes ultimate spits pricepoints as objects instead of as arrays
    if (!angular.isArray(countryData.prices)){
      var tempObj = countryData.prices;
      var tempArray = [];
      for (var key in tempObj){
        if (tempObj.hasOwnProperty(key)) {
           tempArray.push(tempObj[key]);
        }
      }
      countryData.prices = tempArray;
    }

    countryData.prices.forEach(function(pp){
      // fill references' array
      filter.storage.price.push(pp);
      try {
        pp.floatAmount = parseFloat(pp.amount);
      } catch (err) {
        // TODO - make a real logging to file
        //console.log('ConfigurationMain controller - error during prices preprocess: ' + err);
      }
      pp.filtered = false;
      if (!pp.connectivities) return countryData;

      pp.connectivities.forEach(function(conn){
        // fill references' array
        filter.storage.connectivity.push(conn);

        // add to availables collection
        if (!filter.availableConnectivities.some(function(aconn){
          // conn already present in array
          return (aconn.value === conn.rid);
        })) {
          filter.availableConnectivities.push({
            // field names satisfy dashboardSelectFilter predicate template
            value: conn.rid,
            description: conn.rid
          });
        }

        conn.filtered = false;
        if (!conn.credit_providers) return countryData;

        conn.credit_providers.forEach(function(cp){
          // fill references' array
          filter.storage.credit_provider.push(cp);
          var cpName = cp.rid.split('/')[2];

          cp.cp_id = cpName.toUpperCase();

          // add to availables collection
          if (!filter.availableCreditProviders.some(function(acp){
            // cp_id already present in array
            return (acp.value === cp.cp_id);
          })) {
            filter.availableCreditProviders.push({
              // field names satisfy dashboardSelectFilter predicate template
              value: cp.cp_id,
              description: cpName
            });
          }

          cp.filtered = false;
          if (!cp.routes) return countryData;

          // NB - routes are the shortcodes!
          cp.routes.forEach(function(rt){
            // fill references' array
            filter.storage.route.push(rt);

            // add to availables collection
            if (!filter.availableRoutes.some(function(art){
              // shortcode already present in array
              return (art.value === rt.lane);
            })) {
              filter.availableRoutes.push({
                // field names satisfy dashboardSelectFilter predicate template
                value: rt.lane,
                description: rt.lane
              });
            }

            rt.filtered = false;
            if (!rt.contexts) return countryData;

            rt.contexts.forEach(function(co){
              // fill references' array
              filter.storage.context.push(co);
              co.filtered = false;

              // add to availables collection
              if (!filter.availableContexts.some(function(aco){
                // shortcode already present in array
                return (aco.value === co.rid);
              })) {
                filter.availableContexts.push({
                  // field names satisfy dashboardSelectFilter predicate template
                  value: co.rid,
                  description: co.rid
                });
              }
            });

          })
        })
      })
    });
    return countryData;
  }
}])
.service('DashboardFilterService', function(){
  var service = this;

  // will be filled in the ajax data callback
  this.availableConnectivities = [];
  this.availableCreditProviders = [];
  this.availableRoutes = [];
  this.availableContexts = [];

  this.filters = [
           { 
             name: 'price', 
             label: 'Price',
             type: 'input',
             chosen: false
           },
           { 
             name: 'connectivity', 
             label: 'Connectivity',
             type: 'select',
             items: service.availableConnectivities,
             chosen: false
           },
           { 
             name: 'credit_provider', 
             label: 'Credit Provider',
             type: 'select',
             items: service.availableCreditProviders,
             chosen: false
           },
           { 
             name: 'route', 
             label: 'Route',
             type: 'select',
             items: service.availableRoutes,
             chosen: false
           },
           { 
             name: 'context', 
             label: 'Context',
             type: 'select',
             items: service.availableContexts,
             chosen: false
           }
    ];
    
    this.addFilter = function(filter) {
      filter.chosen = true;
    }

    this.removeFilter = function (filter) {
      service.criteria[filter.name] = (filter.name === 'price') ? '' : [];
      filter.chosen = false;
    }

    this.criteria = {
      //country: '',
      price: '',
      connectivity: [],
      credit_provider: [],
      route: [],
      context: []
    };
    
    this.predicates = {
      //country: '',
      price: null,
      connectivity: null,
      credit_provider: null,
      route: null,
      context: null
    };
    
    // will contain references for faster processing
    this.storage = {
      country: [],
      price: [],
      connectivity: [],
      credit_provider: [],
      route: [],
      context: []
    };
    
    this.filterFunctions = {};

    [
      ['price', 'floatAmount'],
      ['connectivity', 'rid'],
      ['credit_provider', 'cp_id'],
      ['route', 'lane'],
      ['context', 'rid']
    ].forEach(function(couple){
      var category = couple[0];
      var attribute = couple[1];
      service.filterFunctions[category] = categoryFilter(category,attribute);
    });

    function categoryFilter(category,attribute){
      return function(predicate){
        if (predicate === null) return;
        service.storage[category].forEach(function(item){
          item.filtered = !predicate(item[attribute]);
        })
      }
    }

    // hides local country accordion item
    this.allPricepointsFiltered = function(pricepoints){
      if (!pricepoints) { // country data not yet uploaded
        return false;
      }
      return pricepoints.every(function(curr){ return (curr.filtered || service.allConnectivitiesFiltered(curr.connectivities)); });
    }

    // hides local pricepoint accordion item
    this.allConnectivitiesFiltered = function(connectivities){
      return connectivities.every(function(curr){ return (curr.filtered || service.allCreditProvidersFiltered(curr.credit_providers)); });
    }

    // hides local connectivity accordion item
    this.allCreditProvidersFiltered = function(creditProviders){
      return creditProviders.every(function(curr){ return (curr.filtered || service.allRoutesFiltered(curr.routes)); });
    }

    // hides local creditProvider accordion item
    this.allRoutesFiltered = function(routes){
      return routes.every(function(curr){ return (curr.filtered || service.allContextsFiltered(curr.contexts)); });
    }

    // hides local route accordion item
    this.allContextsFiltered = function(contexts){
      return contexts.every(function(curr){ return curr.filtered; });
    }
});

