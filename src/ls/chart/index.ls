angular.module \plotDB
  ..service \chartService,
  <[$rootScope $http plConfig sampleChart IOService baseService dataService]> ++
  ($rootScope, $http, plConfig, sampleChart, IOService, baseService, dataService) ->
    service = do
      sample: sampleChart
      #link: (chart) -> "/chart/?k=#{chart._type.location}|#{chart._type.name}|#{chart.key}"
      #link: (chart) -> "/chart/?k=#{chart._type.location.charAt(0)}#{chart.key}"
      link: (chart) -> "/chart/#{chart.key}/"
      thumblink: (chart) -> "#{@sharelink chart}/thumb"
      #TODO better mechanism for switching domain ( dev, staging and production )
      #sharelink: (chart) -> "https://plotdb.com/v/chart/#{chart.key}"
      sharelink: (chart) -> "#{plConfig.urlschema}#{plConfig.domain}/v/chart/#{chart.key}"
    object = (src) ->
      @ <<< do
        name: \untitled
        owner: null
        theme: null
        parent: null
        description: null
        basetype: []
        visualencoding: []
        category: []
        tags: []
        likes: 0
        searchable: false
        doc: {name: 'document', type: 'html', content: service.sample.0.doc.content}
        style: {name: 'stylesheet', type: 'css', content: service.sample.0.style.content}
        code: {name: 'code', type: 'javascript', content: service.sample.0.code.content}
        assets: []
        config: {}
        dimension: {}
        _type: {location: \server, name: \chart}
      @ <<< src
      for k,v of (@dimension or {}) => v.fields = (v.fields or []).map ->
        field = new dataService.Field it
        field.update!
        field
      @

    object.prototype = do
      save: ->
        # we need to track used fields but not keep data.
        payload = JSON.parse(angular.toJson(@))
        for k,v of payload.dimension => (v.fields or []).forEach -> delete it.data
        chart-service.save payload .then (ret) ~> @key = ret.key

      like: (v) -> new Promise (res, rej) ~>
        @likes = @likes + (if v => 1 else -1) >? 0
        $http {url: "/d/chart/#{@key}/like", method: \PUT}
          .success -> res!
          .error (d, status) ~>
            @likes = @likes - (if v => 1 else -1) >? 0
            rej!

      add-file: (name, type, content = null) ->
        file = {name, type, content}
        @assets.push file
        file
      remove-file: (file) ->
        idx = @assets.indexOf(file)
        if idx < 0 => return
        @assets.splice idx, 1
      update-data: ->
        @data = []
        #TODO fields data load by demand
        len = Math.max.apply null,
          [v for k,v of @dimension]
            .reduce(((a,b) -> (a) ++ (b.fields or [])),[])
            .filter(->it.data)
            .map(->it.data.length) ++ [0]
        for i from 0 til len
          ret = {}
          for k,v of @dimension
            if v.multiple =>
              ret[k] = if v.[]fields.length => v.[]fields.map(->it.[]data[i]) else []
              v.field-name = v.[]fields.map -> it.name
            else
              ret[k] = if v.[]fields.0 => that.[]data[i] else null
              v.field-name = if v.[]fields.0 => that.name else null
            #TODO need correct type matching
            if v.type.filter(->it.name == \Number).length =>
              if Array.isArray(ret[k]) => ret[k] = ret[k].map(->parseFloat(it))
              else ret[k] = parseFloat(ret[k])
          @data.push ret
    chartService = baseService.derive \chart ,service, object
    chartService

  ..controller \userChartList,
  <[$scope $http dataService chartService]> ++
  ($scope, $http, data-service, chart-service) ->
    owner = if /^\/user\/([^/]+)/.exec(window.location.pathname) => that.1
    else => (if $scope.user.data => $scope.user.data.key else null)
    $scope.q = {owner}
    if $scope.user.data and owner == $scope.user.data.key => $scope.showPub = true
  ..controller \chartList,
  <[$scope $http $timeout IOService Paging dataService chartService plNotify]> ++
  ($scope, $http, $timeout, IO-service, Paging, data-service, chart-service, plNotify) ->
    $scope.loading = true
    $scope.charts = []
    $scope.q = do
      type: null
      enc: null
      cat: null
      dim: null
      order: \Latest
    $scope.q-lazy = do
      keyword: null
    
    if $scope.$parent.q => $scope.q <<< $scope.$parent.q
    if $scope.$parent.q-lazy => $scope.q-lazy <<< $scope.$parent.q-lazy
    $scope.qmap = do
      type: [
        "Other" "Bar Chart" "Line Chart" "Pie Chart"
        "Area Chart" "Bubble Chart" "Radial Chart" "Calendar"
        "Treemap" "Choropleth" "Cartogram" "Heatmap" "Sankey"
        "Venn Diagram" "Word Cloud" "Timeline" "Mixed" "Pictogram" "Scatter Plot"
      ]
      enc: [
        "Other" "Position" "Position ( Non-aligned )" "Length" "Direction" "Angle"
        "Area" "Volume" "Curvature" "Shade" "Saturation"
      ]
      cat: [
        "Other" "Infographics" "Geographics" "Interactive" "Journalism" "Statistics" "Business"
      ]
      dim: [
        0 1 2 3 4 5 "> 5"
      ]
    $scope.link = -> chart-service.link it
    $scope.paging = Paging
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \chart}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        data = (ret or []).map -> new chartService.chart it
        Paging.flex-width data
        $scope.charts = (if reset => [] else $scope.charts) ++ data

    $scope.$watch 'q', (-> $scope.load-list 500, true), true
    $scope.$watch 'qLazy', (-> $scope.load-list 1000, true), true

    $scope.like = (chart) ->
      if !$scope.user.authed! => return $scope.auth.toggle true
      if !chart => return
      mylikes = $scope.user.data.{}likes.{}chart
      v = mylikes[chart.key] = !mylikes[chart.key]
      chart.like v .catch ->
        plNotify.send \error, "You failed to love. try again later, don't give up!"
        mylikes[chart.key] = !v

    if window.location.search =>
      map = d3.nest!key(->it.0).map(window.location.search.replace(\?,'').split(\&).map(->it.split \=))
      for k,v of $scope.q => if map[k] => $scope.q[k] = map[k].0.1
    Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
