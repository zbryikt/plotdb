// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('payment', ['$scope', '$http', '$timeout', 'plNotify', 'eventBus'].concat(function($scope, $http, $timeout, plNotify, eventBus){
  Stripe.setPublishableKey('pk_test_DE53QFrgknntLkCNsVr1MqrV');
  $scope.payinfo = {
    cvc: null,
    exp_month: null,
    exp_year: null,
    number: null
  };
  $scope.error = {
    all: true
  };
  $scope.prices = [[0, 20, 50], [0, 16, 40]];
  $scope.check = function(target){
    if ($scope.check.handler) {
      $timeout.cancel($scope.check.handler);
    }
    return $scope.check.handler = $timeout(function(){
      var year, k, v;
      if (!target || target === 'exp_month') {
        $scope.error.exp_month = !/^0[1-9]|1[0-2]$/.exec($scope.payinfo.exp_month);
      }
      if (!target || target === 'exp_year') {
        year = $scope.payinfo.exp_year;
        if (year.length < 4) {
          year = "20" + year;
        }
        $scope.error.exp_year = !/^2[01][0-9]{2}$/.exec(year) || new Date().getYear() + 1900 > +year;
      }
      if (!target || target === 'cvc') {
        $scope.error.cvc = !/^[0-9][0-9][0-9]$/.exec($scope.payinfo.cvc);
      }
      if (!target || target === 'number') {
        $scope.error.number = !/^[0-9]{16}$/.exec($scope.payinfo.number) || !Stripe.card.validateCardNumber($scope.payinfo.number);
        $scope.cardtype = Stripe.card.cardType($scope.payinfo.number);
      }
      $scope.error.all = false;
      return $scope.error.all = (function(){
        var ref$, results$ = [];
        for (k in ref$ = $scope.error) {
          v = ref$[k];
          results$.push(v);
        }
        return results$;
      }()).filter(function(it){
        return it;
      }).length || (function(){
        var ref$, results$ = [];
        for (k in ref$ = $scope.payinfo) {
          v = ref$[k];
          results$.push(v);
        }
        return results$;
      }()).filter(function(it){
        return !it;
      }).length;
    }, 500);
  };
  $scope.settings = {
    plan: 1,
    period: 0
  };
  $scope.update = function(){
    eventBus.fire('loading.dimmer.on');
    return Stripe.card.createToken($scope.payinfo, function(state, token){
      return $scope.$apply(function(){
        if (state !== 200) {
          alert("We can't verify this card, please check if the information you provided is correct.");
          eventBus.fire('loading.dimmer.off');
          plNotify.send('danger', "update payment info failed.");
          return;
        }
        return $http({
          url: '/d/payment-method',
          method: 'POST',
          data: {
            token: token.id
          }
        }).success(function(d){
          plNotify.send('success', "payment info updated");
          return $timeout(function(){
            return window.location.reload();
          }, 500);
        }).error(function(d){
          plNotify.send('danger', "something wrong, try again later? ");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    });
  };
  return $scope.subscribe = function(){
    if ($scope.error.all) {
      return;
    }
    eventBus.fire('loading.dimmer.on');
    return Stripe.card.createToken($scope.payinfo, function(state, token){
      return $scope.$apply(function(){
        if (state !== 200) {
          alert("failed to make payment, please check if the information you provided is correct.");
          eventBus.fire('loading.dimmer.off');
          plNotify.send('danger', "payment failed.");
          return;
        }
        console.log(token, token.id);
        return $http({
          url: '/d/subscribe',
          method: 'POST',
          data: {
            settings: $scope.settings,
            token: token.id
          }
        }).success(function(d){
          console.log("before:", JSON.stringify($scope.user.data));
          import$($scope.user.data.payment, d.payment);
          console.log($scope.user.data);
          plNotify.send('success', "you've subscribed!");
          return eventBus.fire('loading.dimmer.off');
        }).error(function(d){
          plNotify.send('danger', "something wrong, try again later? ");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    });
  };
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}