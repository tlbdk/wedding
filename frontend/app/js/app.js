'use strict';

/* App Module */
var weddingApp = angular.module('weddingApp', [
  'ngRoute',
  'toggle-switch',
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
      when('/whoarethesepeople', {
        templateUrl: 'partials/whoarethesepeople.html',
        controller: 'StaticCtrl'
      }).
      when('/thewedding', {
        templateUrl: 'partials/thewedding.html',
        controller: 'StaticCtrl'
      }).
      when('/gettingthere', {
        templateUrl: 'partials/gettingthere.html',
        controller: 'StaticCtrl'
      }).
      when('/accommodation', {
        templateUrl: 'partials/accommodation.html',
        controller: 'StaticCtrl'
      }).
      when('/rsvp', {
        templateUrl: 'partials/rsvp.html',
        controller: 'RSVPCtrl'
      }).
      when('/rsvp/:id', {
        templateUrl: 'partials/rsvpshow.html',
        controller: 'RSVPShowCtrl'
      }).
      when('/gifts', {
        templateUrl: 'partials/gifts.html',
        controller: 'GiftsCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);
