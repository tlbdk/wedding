'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('StaticCtrl', ['$scope', function($scope) {
}]);

weddingControllers.controller('WelcomeCtrl', ['$scope', 'Invitation', function($scope, Invitation) {
  $scope.invitation = Invitation.get();
}]);

weddingControllers.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', '$routeParams', function($scope, $rootScope, $location, $auth, $http, $routeParams) {
  $auth.logout();
  $scope.login = function(key) {
    $http({
      method: 'POST',
      url: 'http://192.168.10.6/api/auth/token',
      data: $.param({key: key}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
      .success(function(data, status, headers, config) {
        if(data.hasOwnProperty('access_token')) {
          $auth.setToken(data.access_token);
        } else {
          $scope.error = data.error;
        }
      })
      .error(function(data, status, headers, config) {
        $scope.error = "Login failed with unknown error";
      });
  };
  
  if($routeParams['key']) {
    $scope.login($routeParams['key']);
  }
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

weddingControllers.controller('GiftsCtrl', ['$scope', '$location', 'Pay', 'ngDialog', function($scope, $location, Pay, ngDialog) {
  $scope.total = 0;
  $scope.gifts = [
    {
      "title": "The wedding trip",
      "img": "gift-wedding-trip.jpg",
      "amount": 0
    },
    {
      "title": "Diving in Sipadan, Malaysia (a stop-over on the way to Australia)",
      "img": "gift-diving.jpg",
      "amount": 0
    },
    {
      "title": "A romantic dinner in Australia / New Zealand",
      "img": "gift-romantic-dinner.jpg",
      "amount": 0
    },
    {
      "title": "Hiking in New Zealand",
      "img": "gift-hiking-new-zealand.jpg",
      "amount": 0
    }
  ];
  
  $scope.increment = function(gift, amount) {
    gift.amount += amount;
    $scope.total += amount;
  }
  
  $scope.decrement = function(gift, amount) {
    if(gift.amount > 0) {
      gift.amount -= amount;
      $scope.total -= amount;
    }
  }
  
  $scope.pay_confirmation = function () {
    ngDialog.open({ template: 'pay_confirmation', scope: $scope });
  }
  
  $scope.pay = function (gifts, address, cb) {
    // Remove gifts with zero amount
    var gifts = gifts.filter(function(gift) {
      return gift.amount > 0;
    });
  
    // Add e-mail to all gifts and post
    var payload = gifts.map(function(gift) {
      var clone = angular.copy(gift);
      clone.address = address;
      return clone;
    });

    Pay.save(payload, function() {
      cb();
      $location.path("/gifts/thanks");
    });
  }
}]);