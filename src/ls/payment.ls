angular.module \plotDB
  ..controller \payment, <[$scope $http plNotify eventBus]> ++ ($scope, $http, plNotify, eventBus) ->
    Stripe.setPublishableKey \pk_test_DE53QFrgknntLkCNsVr1MqrV
    $scope.payinfo = {}
    $scope.createToken = ->
      eventBus.fire \loading.dimmer.on
      Stripe.card.create-token $scope.payinfo, (state, res) ->
        console.log "result from Stripe"
        console.log "status code: ", state
        console.log res
        $http do
          url: \/d/testpay
          method: \POST
          data: res
        .success (d) ->
          plNotify.send \success, "you've subscribed!"
          eventBus.fire \loading.dimmer.off
        .error (d) ->
          plNotify.send \danger, "something wrong, try again later? "
          eventBus.fire \loading.dimmer.off


