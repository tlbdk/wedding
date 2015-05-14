'use strict';

/* App Module */
var weddingApp = angular.module('weddingApp', [
  'ngRoute',
  'toggle-switch',
  'ngDialog',
  'satellizer',
  'weddingControllers',
  'weddingFilters',
  'weddingServices',
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
      when('/gifts/thanks', {
        templateUrl: 'partials/giftsthanks.html',
        controller: 'StaticCtrl'
      }).
      when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'StaticCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }
]);

weddingApp.config(['$authProvider', function($authProvider) {
  /* $authProvider.oauth2({
      name: 'custom',
      url: '/auth/custom',
      redirectUri: window.location.origin,
      clientId: 'd6d2b510d18471d2e22aa202216e86c42beac80f9a6ac2da505dcb79c7b2fd99',
      responseType: 'token',
      authorizationEndpoint: 'http://192.168.10.6/api/oauth/authorize'
    }); */
}]);


weddingApp.run(['$rootScope', '$window', '$location', '$auth', function($rootScope, $window, $location, $auth) {  
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if (!$auth.isAuthenticated()) {      
      if (next.templateUrl !== "partials/login.html") {
        // no logged user, redirect to /login
        $location.path("/login");
      }
    }
  });
}]);
