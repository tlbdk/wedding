'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('StaticCtrl', ['$scope', function($scope) {
}]);

weddingControllers.controller('RSVPCtrl', ['$scope', function($scope) {
    $scope.people = [
  {
    "name": "Troels Liebe Bentsen",
    "coming": true,
    "transportation": true,
    "children": false,
    "food": "",
    "comments": ""
  },
  {
    "name": "Andrew",
    "coming": true,
    "transportation": true,
    "children": false,
    "food": "",
    "comments": ""
  },
  {
    "name": "Aisma",
    "coming": true,
    "transportation": true,
    "children": false,
    "food": "",
    "comments": ""
  }
];
}]);