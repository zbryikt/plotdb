angular.module \plotDB
  ..filter \tags, -> -> (it or "").split(\,)
  ..filter \length, -> -> [k for k of it].length
  ..service \chartService, <[$rootScope sampleChart IOService]> ++ ($rootScope, sampleChart, IOService) ->
    Chart = (config = {}) -> @ <<< config
    Chart.prototype = do
      name: \untitled
      desc: null, tags: null, owner: null, key: null,
      type: {name: \chart, location: \server}
      doc: {name: 'document', type: 'html', content: sampleChart.doc.content}
      style: {name: 'stylesheet', type: 'css', content: sampleChart.style.content}
      code: {name: 'code', type: 'javascript', content: sampleChart.code.content}
      config: {}
      dimension: {}
      assets: {}
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
      list: (filter = {}) -> IOService.list {type: \chart, location: \any}
      sample: sampleChart
    ret.init!
    ret

  ..controller \chartEditor,
  <[$scope $http $timeout dataService chartService]> ++
  ($scope, $http, $timeout, data-service, chartService) ->
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
      chart: chartService.create!
      canvas: do
        node: document.getElementById(\chart-renderer)
        window: document.getElementById(\chart-renderer).contentWindow

    $scope <<< do # Functions
      save: -> chartService.save $scope.chart .then -> $scope.chart <<< it #TODO notification
      load: (type, key) -> chartService.load type, key .then -> $scope.chart <<< it
      dimension: bind: (event, dimension, field = {}) ->
        dataset = data-service.find field
        if !dataset => return
        data-service.field.update field
        dimension.fields = [field]
        $scope.render!
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
        document.body.addEventListener \keydown, (e) -> 
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) => $scope.$apply -> 
            temp = @vis
            if @vis == \preview and @lastvis => @vis = @lastvis
            else if @vis == \preview => @vis = \code
            else @vis = \preview
            @lastvis = temp
      check-param: ->
        if !window.location.search => return
        ret = /[?&]k=([^&#|]+)\|([^&#]+)/.exec(window.location.search)
        if !ret => return
        [location,key] = ret[1,2]
        $scope.load {name: \chart, location}, key
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
          $scope.chart.thumbnail = data.payload
          $scope.chart.save!
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

  ..controller \mychart, <[$scope $http dataService]> ++ ($scope, $http, data-service) ->
    # My Charts
    $scope.mycharts = []
    list = JSON.parse(localStorage.getItem("/list/chart")) or []
    $scope.mycharts = list.map ->
      chart = JSON.parse(localStorage.getItem("/chart/#it"))
    .filter(->it)
    $http do
      url: \/d/chart/
      method: \GET
    .success (ret) -> 
      console.log ret
      $scope.mycharts ++= ret

    $scope.goto = (chart) ->
      window.location.href = "/chart.html?key=#{chart.key}"
