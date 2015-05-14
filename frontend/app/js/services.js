'use strict';

/* Services */
var weddingServices = angular.module('weddingServices', ['ngResource']);

weddingServices.factory('RSVP', ['$resource', 'Configuration', function($resource, Configuration){
  return $resource(Configuration.API + '/rsvp/:id', { id: '@id' }, {
     update: {
      method: 'PUT',
    }
  },{
    //stripTrailingSlashes: false
  });
}]);

weddingServices.factory('Invitation', ['$resource', 'Configuration', function($resource, Configuration){
  return $resource(Configuration.API + '/invitation');
}]);

weddingServices.factory('Pay', ['$resource', 'Configuration', function($resource, Configuration){
  return $resource(Configuration.API + '/pay');
}]);

weddingServices.service('Authenticate', ['$http', 'Configuration', function($http, Configuration){
  this.login = function (key, cb) {
    $http({
      method: 'POST',
      url: Configuration.API + '/auth/token',
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

weddingServices.service("Configuration", function() {
  if (window.location.host.match(/^127\.0\.0\.1/)) {
    return this.API = 'http://localhost:8080';
  } else {
    return this.API = 'https://www.married.dk/api/';
  }
});