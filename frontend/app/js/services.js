'use strict';

/* Services */

var weddingServices = angular.module('weddingServices', ['ngResource']);

weddingServices.factory('RSVP', ['$resource', function($resource){
  return $resource('http://localhost.nversion.dk/api/rsvp/:id', { id: '@id' }, {
     update: {
      method: 'PUT',
    }
  },{
    //stripTrailingSlashes: false
  });
}]);

weddingServices.factory('Invitation', ['$resource', function($resource){
  return $resource('http://localhost.nversion.dk/api/invitation');
}]);

weddingServices.factory('Pay', ['$resource', function($resource){
  return $resource('http://localhost.nversion.dk/api/pay');
}]);