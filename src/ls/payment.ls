angular.module \plotDB
  ..controller \payment,
  <[$scope $http $timeout plNotify eventBus]> ++
  ($scope, $http, $timeout, plNotify, eventBus) ->
    Stripe.setPublishableKey \pk_test_DE53QFrgknntLkCNsVr1MqrV
    $scope.payinfo = {cvc:null,exp_month:null,exp_year:null,number:null}
    $scope.error = {all: true}
    $scope.prices = [[0,20,50],[0,16,40]]
    $scope.check = (target) ->
      if $scope.check.handler => $timeout.cancel $scope.check.handler
      $scope.check.handler = $timeout (->
        if !target or target == \exp_month =>
          $scope.error.exp_month = !!!(/^0[1-9]|1[0-2]$/.exec($scope.payinfo.exp_month))
        if !target or target == \exp_year =>
          year = $scope.payinfo.exp_year
          if year.length < 4 => year = "20#year"
          $scope.error.exp_year = !!!(/^2[01][0-9]{2}$/.exec(year)) or (new Date!getYear! + 1900) > +year
        if !target or target == \cvc =>
          $scope.error.cvc = !!!(/^[0-9][0-9][0-9]$/.exec($scope.payinfo.cvc))
        if !target or target == \number =>
          $scope.error.number = (
            !!!(/^[0-9]{16}$/.exec($scope.payinfo.number)) or
            Stripe.card.validateCardNumber $scope.payinfo.number
          )
          $scope.cardtype = Stripe.card.cardType $scope.payinfo.number
        console.log [v for k,v of $scope.error]
        console.log [v for k,v of $scope.payinfo].filter(->!it).length
        $scope.error.all = false
        $scope.error.all = (
          [v for k,v of $scope.error].filter(->it).length or
          [v for k,v of $scope.payinfo].filter(->!it).length
        )
      ), 500
    $scope.setting = do
      plan: 1
      period: 0
    $scope.createToken = ->
      if $scope.error.all => return
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


