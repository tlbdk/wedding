'use strict';

/* Services */

var weddingServices = angular.module('weddingServices', ['ngResource']);

weddingServices.factory('Person', ['$resource',
  function($resource){
    return $resource('Person/:personId.json', {}, {
      query: { method:'GET', params:{ personId: 'persons' } }
    });
  }]);