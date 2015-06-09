'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('StaticCtrl', ['$scope', function($scope) {
}]);

weddingControllers.controller('WelcomeCtrl', ['$scope', 'Invitation', function($scope, Invitation) {
  $scope.invitation = Invitation.get();
}]);

weddingControllers.controller('LoginCtrl', ['$scope', '$auth', '$routeParams', 'Authenticate', function($scope, $auth, $routeParams, Authenticate) {
  $auth.logout();
  $scope.login = function(key) {
    Authenticate.login(key, function(token, error) {
      if(!error) {
        $auth.setToken(token);
      } else {
        $scope.error = error;
      }
    })
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

weddingControllers.controller('GiftsCtrl', ['$scope', '$location', 'Pay', 'ngDialog', 'ExchangeRates', function($scope, $location, Pay, ngDialog, ExchangeRates) {
  $scope.rates = ExchangeRates.get();
  
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
    gift.amount = parseInt(gift.amount) + amount;
  }
  
  $scope.decrement = function(gift, amount) {
    if(parseInt(gift.amount) - amount > 0) {
      gift.amount = parseInt(gift.amount) - amount;
    } else {
      gift.amount = 0;
    }
  }
  
  $scope.getTotal = function() {
    var total = 0;
    $scope.gifts.forEach(function(gift, index){
      total += parseInt(gift.amount) || 0;
    });
    return total;
  }
  
  $scope.pay_confirmation = function () {
    ngDialog.open({ template: 'pay_confirmation', scope: $scope });
  }
  
  $scope.pay = function (gifts, comment, cb) {
    // Remove gifts with zero amount
    var gifts = gifts.filter(function(gift) {
      return gift.amount > 0;
    });
  
    // Add e-mail to all gifts and post
    var payload = gifts.map(function(gift) {
      var clone = angular.copy(gift);
      clone.comment = comment;
      return clone;
    });

    Pay.save(payload, function() {
      cb();
      $location.path("/gifts/thanks");
    });
  }
}]);