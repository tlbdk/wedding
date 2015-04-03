'use strict';

/* App Module */
var weddingApp = angular.module('weddingApp', [
  'ngRoute',
  'weddingControllers',
  'weddingFilters',
  'weddingServices'
]);

weddingApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/welcome', {
        templateUrl: 'partials/welcome.html',
        controller: 'WelcomeCtrl'
      }).
      when('/gettinghere', {
        templateUrl: 'partials/gettinghere.html',
        controller: 'WelcomeCtrl'
      }).
      when('/accommodation', {
        templateUrl: 'partials/accommodation.html',
        controller: 'WelcomeCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);
