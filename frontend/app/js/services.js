'use strict';

/* Services */

var weddingServices = angular.module('weddingServices', ['ngResource']);

weddingServices.factory('RSVP', ['$resource', function($resource){
  return $resource('http://192.168.10.6/api/rsvp/:id', { id: '@id' }, {
     update: {
      method: 'PUT',
    }
  },{
    //stripTrailingSlashes: false
  });
}]);

weddingServices.factory('Invitation', ['$resource', function($resource){
  return $resource('http://192.168.10.6/api/invitation');
}]);

weddingServices.factory('Pay', ['$resource', function($resource){
  return $resource('http://192.168.10.6/api/pay');
}]);