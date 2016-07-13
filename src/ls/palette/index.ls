angular.module \plotDB
  ..service \paletteService,
  <[$rootScope samplePalette IOService baseService]> ++
  ($rootScope, samplePalette, IOService, baseService) ->
    name = \palette
    service = do
      sample: samplePalette
      list2pal: (name, list) -> {name, colors: list.map(-> hex: it)}
      list: ->
        IOService.list-remotely {name: \palette, location: \server}
          .then (r) -> r.map -> new Dataset it

    Palette = (config) ->
      @ <<< do
        name: ""
        colors: []
        owner: null, createdtime: new Date!, modifiedtime: new Date!
        permission: { switch: [], value: []}
        _type: {location: \server, name: \palette}
      @ <<< config
      @

    paletteService = baseService.derive name, service, Palette
    paletteService

  ..controller \paletteList,
  <[$scope IOService paletteService Paging plNotify eventBus]> ++
  ($scope, IOService, paletteService, Paging, plNotify, eventBus) ->
    $scope.paging = Paging
    $scope.samplesets = paletteService.sample.map -> it <<< {key: -Math.random!}
    $scope.palettes = [] ++ $scope.samplesets
    $scope.myPalettes = []
    $scope.setcur = -> $scope.cur = it
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \palette}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        data = (ret or []).map -> new paletteService.palette it
        $scope.myPalettes = (if reset => [] else $scope.myPalettes) ++ data
        $scope.palettes = $scope.samplesets ++ $scope.myPalettes
        if !$scope.cur => $scope.setcur $scope.palettes[0]
    $scope.$watch 'palettes', ->
      for i from 0 til $scope.palettes.length =>
        pal = $scope.palettes[i]
        pal.width = 100 / pal.colors.length
    if $(\#pal-list-end) => Paging.load-on-scroll (-> $scope.load-list!), $(\#pal-list-end), $(\#pal-editor-loader)
    $scope.load-list!
    eventBus.listen \paledit.update, (pal) ->
      matched = $scope.myPalettes.filter(->it.key == pal.key)
      if matched.length => matched.0 <<< pal
      else => $scope.load-list!
    eventBus.listen \paledit.delete, (key) ->
      $scope.myPalettes = $scope.myPalettes.filter(->it.key != key)
      $scope.palettes = $scope.palettes.filter(->it.key != key)
