'use strict';

/* Filters */

var weddingFilters = angular.module('weddingFilters', []);

weddingFilters.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});

weddingFilters.filter('noCommaCurrency', ['$filter', '$locale', function(filter, locale) {
  var currencyFilter = filter('currency');
  var formats = locale.NUMBER_FORMATS;
  return function(amount, currencySymbol) {
    var value = currencyFilter(amount, currencySymbol);
    var sep = value.indexOf(formats.DECIMAL_SEP);
    if(amount >= 0) { 
      return value.substring(0, sep).replace(/,/, '');
    }
    return value.substring(0, sep) + ')'.replace(/,/, '');
  };
}]);