'use strict';

/* App Module */
var weddingApp = angular.module('weddingApp', [
  'ngRoute',
  'weddingControllers',
  'weddingFilters',
  'weddingServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/welcome', {
        templateUrl: 'partials/welcome.html',
        controller: 'WelcomeCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);