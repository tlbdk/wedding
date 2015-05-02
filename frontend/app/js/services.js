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