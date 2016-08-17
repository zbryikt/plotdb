angular.module \plotDB
  ..service \sampleTheme, <[$rootScope]> ++ ($rootScope) ->
    plotdb.theme.sample
  ..service \themeService,
  <[$rootScope $http IOService sampleTheme baseService plNotify eventBus]> ++
  ($rootScope, $http, IOService, sampleTheme, baseService, plNotify, eventBus) ->
    service = do
      sample: sampleTheme
      link: (theme) -> "/theme/#{theme.key}"
      thumblink: (theme) -> "/s/theme/#{theme.key}.png"
      sharelink: (chart) -> "#{plConfig.urlschema}#{plConfig.domain}/v/theme/#{chart.key}"
      list: ->
        IOService.list-remotely {name: \theme, location: \server}
          .then (r) -> r.map -> new object it

    object = (src) ->
      @ <<< do
        name: \untitled
        description: null, tags: null
        theme: null
        doc: {name: 'document', type: 'html', content: service.sample.0.{}doc.content or ""}
        style: {name: 'stylesheet', type: 'css', content: service.sample.0.{}style.content or ""}
        code: {name: 'code', type: 'javascript', content: service.sample.0.{}code.content or ""}
        config: {}
        dimension: {}
        assets: []
        #thumbnail: null
        #isType: false
        likes: 0
        parent: null
        _type: {location: \server, name: \theme}
      @ <<< src
      if !Array.isArray(@assets) => @assets = []
      @

    object.prototype = do
      add-file: (name, type, content = null) ->
        file = {name, type, content}
        @assets.push file
        file
      remove-file: (file) ->
        idx = @assets.indexOf(file)
        if idx < 0 => return
        @assets.splice idx, 1

    themeService = baseService.derive \theme, service, object
    themeService

  ..controller \themeList,
  <[$scope $http IOService Paging dataService themeService]> ++
  ($scope, $http, IO-service, Paging, data-service, theme-service) ->
    $scope.loading = true
    $scope.load = (theme) -> window.location.href = theme-service.link theme
    $scope.link = -> theme-service.link it
    $scope.paging = Paging
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} # <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \theme}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        $scope.loading = false
        data = (ret or []).map -> new themeService.theme it
        #Paging.flex-width data
        $scope.themes = (if reset or !$scope.themes => [] else $scope.themes) ++ data

    $scope.load-list 0, true
    Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
