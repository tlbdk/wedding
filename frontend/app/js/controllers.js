'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('WelcomeCtrl', ['$scope', function($scope) {
    $scope.title = "Welcome";
}]);