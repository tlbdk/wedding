'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('StaticCtrl', ['$scope', function($scope) {
}]);

weddingControllers.controller('RSVPCtrl', ['$scope', 'RSVP', function($scope, RSVP) {
  $scope.guests = RSVP.query();
}]);

weddingControllers.controller('RSVPShowCtrl', ['$scope', '$location', '$routeParams', 'RSVP', function($scope, $location, $routeParams, RSVP) {
  $scope.guest = RSVP.get({ id: $routeParams.id });
  
  $scope.save = function(guest) {
    guest.$update(function() {
      $location.path("/rsvp");
    });
  };
}]);