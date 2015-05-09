'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('StaticCtrl', ['$scope', function($scope) {
}]);

weddingControllers.controller('WelcomeCtrl', ['$scope', 'Invitation', function($scope, Invitation) {
  $scope.invitation = Invitation.get();
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

weddingControllers.controller('GiftsCtrl', ['$scope', 'Pay', function($scope, Pay) {
  $scope.email = "";
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
  $scope.pay = function (gifts) {
    // Remove gifts with zero amount
    var gifts = gifts.filter(function(gift) {
      return gift.amount > 0;
    });
  
    // Add e-mail to all gifts and post
    var payload = gifts.map(function(gift) {
      var clone = angular.copy(gift);
      clone.email = $scope.email
      return clone;
    });
    Pay.save(payload, function() {
      
    });
  }
}]);