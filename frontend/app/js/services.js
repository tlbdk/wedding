'use strict';

/* Services */

var baseurl = "http://localhost:8080";
//var baseurl = "http://192.168.10.6/api";


var weddingServices = angular.module('weddingServices', ['ngResource']);

weddingServices.factory('RSVP', ['$resource', function($resource){
  return $resource(baseurl + '/rsvp/:id', { id: '@id' }, {
     update: {
      method: 'PUT',
    }
  },{
    //stripTrailingSlashes: false
  });
}]);

weddingServices.factory('Invitation', ['$resource', function($resource){
  return $resource(baseurl + '/invitation');
}]);

weddingServices.factory('Pay', ['$resource', function($resource){
  return $resource(baseurl + '/pay');
}]);

weddingServices.service('Authenticate', ['$http', function($http){
  this.login = function (key, cb) {
    $http({
      method: 'POST',
      url: baseurl + '/auth/token',
      data: $.param({ key: key }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data, status, headers, config) {
      if(data.hasOwnProperty('access_token')) {
        cb(data.access_token);
      } else if(data.hasOwnProperty('error')) {
        cb(null, data.error);
      } else {
        cb(null, "Login failed with unknown error");
      }
    })
    .error(function(data, status, headers, config) {
      cb(null, "Login failed with unknown transport error");
    });
  }
}]);