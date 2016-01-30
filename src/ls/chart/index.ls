angular.module \plotDB
  ..filter \tags, -> -> (it or "").split(\,)
  ..filter \length, -> -> [k for k of it].length
  ..service \chartService,
  <[$rootScope sampleChart IOService]> ++
  ($rootScope, sampleChart, IOService) ->
    Chart = (config = {}) -> @ <<< config
    Chart.prototype = do
      name: \untitled
      desc: null, tags: null, owner: null, key: null,
      type: {name: \chart, location: \server}
      doc: {name: 'document', type: 'html', content: sampleChart.doc.content}
      style: {name: 'stylesheet', type: 'css', content: sampleChart.style.content}
      code: {name: 'code', type: 'javascript', content: sampleChart.code.content}
      permission: {switch: [], value: []}
      config: {}
      dimension: {}
      assets: []
      thumbnail: null
      isType: false
      save: -> ret.save @ .then ~> @ <<< it
      sync: -> ret.load @type, @key .then ~> @ <<< it
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
            ret[k] = if v.[]fields.0 => that.[]data[i] else null
            #TODO need correct type matching
            if v.type.filter(->it.name == \Number).length => ret[name] = parseFloat(ret[name])
          @data.push ret

    ret = do
      init: ->
      create: -> new Chart it
      save: (item) -> IOService.save item
      load: (type, key) -> IOService.load type, key
      list: (type = {name: \chart, location: \any}, filter = {}) -> IOService.list type
      sample: sampleChart
    ret.init!
    ret

  ..controller \chartEditor,
  <[$scope $http $timeout $interval dataService chartService plNotify]> ++
  ($scope, $http, $timeout, $interval, data-service, chart-service, plNotify) ->
    $scope <<< do # Variables
      showsrc: true
      vis: \preview
      lastvis: null
      plotdomain: \http://localhost/
      error: null
      codemirror: do
        code:  lineWrapping: true, lineNumbers: true mode: \javascript
        style: lineWrapping: true, lineNumbers: true, mode: \css
        doc:   lineWrapping: true, lineNumbers: true, mode: \xml
      chart: chart-service.create!
      canvas: do
        node: document.getElementById(\chart-renderer)
        window: document.getElementById(\chart-renderer).contentWindow

    $scope <<< do # Functions
      save: (astype = false) -> 
        if astype and @chart.type.name == \chart =>
          @chart.type.name = \charttype
          @chart.key = null
        @canvas.window.postMessage {type: \snapshot}, @plotdomain
      load: (type, key) -> 
        chart-service.load type, key .then ~> @chart <<< it
      dimension: do
        bind: (event, dimension, field = {}) ->
          dataset = data-service.find field
          if !dataset => return
          data-service.field.update field
          dimension.fields = [field]
          $scope.render!
        unbind: (event, dimension, field = {}) ->
          idx = dimension.fields.index-of(field)
          if idx < 0 => return
          dimension.fields.splice idx, 1
      render: ->
        @chart.update-data!
        for k,v of @chart => if typeof(v) != \function => @chart[k] = v
        @canvas.window.postMessage {type: \render, payload: @chart}, @plotdomain
      countline: ->
        <~ <[code style doc]>.map
        @chart[it].lines = @chart[it].content.split(\\n).length
        @chart[it].size = @chart[it].content.length

    $scope <<< do # Behaviors
      hid-handler: ->
        # Switch Panel by Alt-Enter
        switch-panel = ~>
          temp = @vis
          if @vis == \preview and @lastvis => @vis = @lastvis
          else if @vis == \preview => @vis = \code
          else @vis = \preview
          @lastvis = temp
        $scope.codemirrored = (editor) ->
          toggle = -> setTimeout (-> switch-panel!), 0
          editor.setOption \extraKeys, do
            "Cmd-Enter": toggle # so event will pass through to global handler
            "Alt-Enter": toggle
        document.body.addEventListener \keydown, (e) -> 
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) => $scope.$apply -> switch-panel!

      check-param: ->
        if !window.location.search => return
        ret = /[?&]k=([^&#|]+)\|([^&#|]+)\|([^&#|]+)/.exec(window.location.search)
        if !ret => return
        [location,type,key] = ret[1,2,3]
        if type != \charttype => type = \chart
        $scope.load {name: type, location}, key
      monitor: ->
        @$watch 'chart.doc.content', ~> @countline!
        @$watch 'chart.style.content', ~> @countline!
        @$watch 'chart.code.content', ~> @countline!
        @$watch 'chart.doc.content', ~> @render!
        @$watch 'chart.style.content', ~> @render!
        @$watch 'chart.code.content', (code) ~>
          @canvas.window.postMessage {type: \parse, payload: code}, @plotdomain
        @$watch 'chart.config', (~> @render!), true
      communicate: -> # talk with canvas window
        ({data}) <~ window.addEventListener \message, _, false
        if !data or typeof(data) != \object => return
        if data.type == \error => $scope.$apply -> $scope.error = data.payload
        else if data.type == \alt-enter => $scope.$apply -> $scope.vis = 'code'
        else if data.type == \snapshot =>
          #TODO need sanity check
          @chart.thumbnail = data.payload
          @chart.save!then (ret) -> 
            $scope.$apply -> $scope.chart <<< ret
            plNotify.send \success, "chart saved"
        else if data.type == \parse =>
          {config,dimension} = JSON.parse(data.payload)
          for k,v of @chart.dimension => if dimension[k]? => dimension[k].fields = v.fields
          for k,v of @chart.config => if config[k]? => config[k].value = v.value
          for k,v of config => if !(v.value?) => v.value = v.default
          @chart <<< {config, dimension}
          $scope.render!
        else if data.type == \loaded =>
          @canvas.window.postMessage {type: \parse, payload: @chart.code.content}, @plotdomain
      init: ->
        @communicate!
        @hid-handler!
        @monitor!
        @check-param!
    $scope.init!
    #$scope.$watch 'ldcp', (-> console.log ">", it), true
    #$interval (-> console.log $scope.ldcp), 1000

  ..controller \mychart,
  <[$scope $http dataService chartService]> ++
  ($scope, $http, data-service, chart-service) ->
    (ret) <- chart-service.list!then
    <- $scope.$apply
    $scope.mycharts = ret
    $scope.goto = (chart) ->
      window.location.href = "/chart/?k=#{chart.type.location}|#{chart.type.name}|#{chart.key}"
  ..controller \chartList,
  <[$scope $http dataService chartService]> ++
  ($scope, $http, data-service, chart-service) ->
    $scope.charttypes = []
    (ret) <- chart-service.list {name: \charttype, location: \any} .then
    $scope.charttypes = ret
