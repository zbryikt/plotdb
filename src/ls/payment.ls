angular.module \plotDB
  ..controller \payment,
  <[$scope $http $timeout plNotify eventBus]> ++
  ($scope, $http, $timeout, plNotify, eventBus) ->
    #if !(Stripe?) => return
    #Stripe.setPublishableKey \pk_test_DE53QFrgknntLkCNsVr1MqrV
    $scope.payinfo = {cvc:null,exp_month:null,exp_year:null,number:null}
    #$scope.payinfo = {cvc:'123',exp_month:'02',exp_year:'18',number:'4242424242424242'}
    $scope.error = {all: true}
    $scope.prices = [[0,20,50],[0,200,500]]
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
            !!!(/^[0-9]{16}$/.exec($scope.payinfo.number)) #or
            #!Stripe.card.validateCardNumber($scope.payinfo.number)
          )
          d6 = +($scope.payinfo.number or "").substring(0,6)
          d4 = +($scope.payinfo.number or "").substring(0,4)

          if /^4/.exec($scope.payinfo.number) => $scope.cardtype = \Visa
          else if /^3[47]/.exec($scope.payinfo.number) => $scope.cardtype = 'American Express'
          else if d4 >= 3528 and d4 <= 3589 => $scope.cardtype= \JCB
          else if (d6 >= 510000 and d6 <= 559999) or (d6 >= 222100 and d6 <= 272099) => $scope.cardtype = \MasterCard
          else $scope.cardtype = ''
          #$scope.cardtype = Stripe.card.cardType $scope.payinfo.number
        $scope.error.all = false
        $scope.error.all = (
          [v for k,v of $scope.error].filter(->it).length or
          [v for k,v of $scope.payinfo].filter(->!it).length
        )
      ), 500
    $scope.settings = do
      choose: (plan, period) ->
        if $scope.user.data and plan == $scope.user.data.{}payment.plan => return
        if plan? =>
          $scope.scrollto $('#payment-your-choice'), 500
          @plan = plan
        if peroid? => @peroid = peroid
      plan: 1
      period: 0
      init: -> @plan = (if $scope.user.data => $scope.user.data.{}payment.plan else null) or 0
    $scope.settings.init!
    $scope.update = ->
      eventBus.fire \loading.dimmer.on
      Stripe.card.create-token $scope.payinfo, (state, token) -> $scope.$apply ->
        if state != 200 =>
          alert "We can't verify this card, please check if the information you provided is correct."
          eventBus.fire \loading.dimmer.off
          plNotify.send \danger, "update payment info failed."
          return
        $http do
          url: \/d/payment-method
          method: \POST
          data: {token: token.id}
        .success (d) ->
          plNotify.send \success, "payment info updated"
          $timeout (-> window.location.reload!), 500
        .error (d) ->
          plNotify.send \danger, "something wrong, try again later? "
          eventBus.fire \loading.dimmer.off
    $scope.subscribe = ->
      if $scope.settings.plan and $scope.error.all => return
      eventBus.fire \loading.dimmer.on
      _subscribe = (token = {})->
        $http do
          url: \/d/subscribe
          method: \POST
          data: {settings: $scope.settings, token: token.id}
        .success (d) ->
          $scope.user.data.payment <<< d.payment
          if !d.payment.plan => plNotify.send \success, "you've switched to free plan."
          else plNotify.send \success, "you've subscribed!"
          eventBus.fire \loading.dimmer.off
        .error (d) ->
          plNotify.send \danger, "something wrong, try again later? "
          eventBus.fire \loading.dimmer.off
      if $scope.settings.plan == 0 => return _subscribe!

      TPDirect.setPublishableKey(10289, "90Ymc8w2YK4ANT8UOhIdH70F7L959dY93KurOhtT", 'sandbox')
      TPDirect.card.createToken("4242424242424242", "04", "22", "955", (result) ->
        console.log(result);
      )

      /*
      Stripe.card.create-token $scope.payinfo, (state, token) -> $scope.$apply ->
        if state != 200 =>
          #TODO detail error handling
          alert "failed to make payment, please check if the information you provided is correct."
          eventBus.fire \loading.dimmer.off
          plNotify.send \danger, "payment failed."
          return
        _subscribe token
      */
    $("[data-toggle='tooltip']").tooltip!
