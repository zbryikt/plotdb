angular.module \plotDB
  ..filter \tags, -> -> (it or "").split(\,)
  ..controller \chartEditor,
  <[$scope $timeout dataService sampleChart]> ++
  ($scope, $timeout, data-service, sampleChart) ->
    $scope.plotdomain = \http://localhost/
    $scope.vis = \preview
    $scope.showsrc = true
    $scope.chart = do
      init: ->
        $scope.chart.code.content = sampleChart.code.content
      setdim: (field = {}, event, dim) ->
        dataset = data-service.find field
        if !dataset => return
        data-service.field.update field
        dim.fields = [field]
        @render!
      render: ->
        data = []
        for k,dim0 of @{}dimensions
          if dim0.fields and dim0.fields.length and dim0.fields.0.data and dim0.fields.0.data.length => break
          dim0 = null
        if dim0 =>
          for i from 0 til dim0.fields.0.data.length
            ret = {}
            for name,dim of @dimensions
              f = dim.[]fields.0
              ret[name] = if f => f.[]data[i] else null
              #TODO need correct type matching
              if dim.type.filter(->it.name == \Number).length => ret[name] = parseFloat(ret[name])
            data.push ret
        config = {} <<< @configs
        payload = {data,config} <<< $scope.chart{doc,style,code}
        visualizer = document.getElementById(\visualizer)
        visualizer.contentWindow.postMessage {type: \render, payload}, $scope.plotdomain
      doc: do
        option: do
          mode: \xml
          lineWrapping: true
          lineNumbers: true
        content: ""
      style: 
        option: do
          mode: \css
          lineWrapping: true
          lineNumbers: true
        content: ""
      code: 
        option: do
          mode: \javascript
          lineWrapping: true
          lineNumbers: true
        content: "function() {}"
    $scope.switch-panel = ->
      old = $scope.vis
      if $scope.vis == 'preview' and $scope.oldvis => $scope.vis = $scope.oldvis
      else if $scope.vis == 'preview' => $scope.vis = 'code'
      else $scope.vis = 'preview'
      if old != 'preview' => $scope.oldvis = old
    $scope.codemirrored = (editor) ->
      toggle = -> #setTimeout (->$scope.$apply -> $scope.switch-panel!), 10
      editor.setOption \extraKeys, do
        "Cmd-Enter": toggle
        "Alt-Enter": toggle
    document.body.addEventListener \keydown, (e) -> 
      if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) => $scope.$apply -> $scope.switch-panel!
    $scope.chart.init!
    countline = ->
      for item in <[code style doc]>
        $scope.chart[item].lines = $scope.chart[item].content.split(\\n).length
        $scope.chart[item].size = $scope.chart[item].content.length
    $scope.$watch 'chart.doc.content', countline
    $scope.$watch 'chart.style.content', countline
    $scope.$watch 'chart.code.content', countline
    $scope.$watch 'chart.doc.content', -> $scope.chart.render!
    $scope.$watch 'chart.style.content', -> $scope.chart.render!
    $scope.$watch 'chart.code.content', (code) ->
      visualizer.contentWindow.postMessage {type: \parse, payload: code}, $scope.plotdomain

    $scope.$watch 'chart.configs', (-> $scope.chart.render!), true
    window.addEventListener \message, (({data}) ->
      if !data or typeof(data) != typeof({}) => return
      if data.type == \error => $scope.$apply -> $scope.codeError = data.payload
      else if data.type == \alt-enter => $scope.$apply -> $scope.vis = 'code'
      else if data.type == \snapshot =>
        #TODO need sanity check
        $scope.chart.thumbnail = data.payload
        $scope.save $scope.chart.isType
      else if data.type == \parse =>
        {config,mapping} = JSON.parse(data.payload)
        for k,v of $scope.chart.{}configs => if config[k] => config[k].value = v.value
        for k,v of config => if !config[k].value => config[k].value = config[k].default
        for k,v of $scope.chart.{}dimensions => if mapping[k] => mapping[k].fields = v.fields
        $scope.chart <<< {dimensions: mapping, configs: config}
        $scope.chart.render!
      else if data.type == \loaded =>
        visualizer.contentWindow.postMessage {type: \parse, payload: $scope.chart.{}code.content}, $scope.plotdomain
    ), false
    $scope.save = (as-type = false) ->
      c = $scope.chart
      if !c.thumbnail => visualizer.contentWindow.postMessage {type: \snapshot}, $scope.plotdomain
      c.isType = as-type
      #TODO assets
      dimension = {}
      for k,v of c.dimensions => 
        dimension[k] = {} <<< v
        for item in dimension[k].[]fields => delete item.data
      if as-type => for k,v of dimension => v.fields = []
      chart = do
        doc: c.doc.content
        style: c.style.content
        code: c.code.content
        config: c.configs
        dimension: dimension
        thumbnail: c.thumbnail
        isType: c.isType
      chart.name = $scope.name
      chart.desc = $scope.desc
      chart.tags = $scope.tags

      type = if as-type => "charttype" else "charts"

      list = JSON.parse(localStorage.getItem("/list/#type")) or []
      if list.indexOf($scope.name) < 0 => 
        list.push $scope.name
        localStorage.setItem("/list/#type", angular.toJson(list.filter(->it)))
      localStorage.setItem("/#type/#{$scope.name}", angular.toJson(chart))
      setTimeout ( ->
        data = JSON.parse(localStorage.getItem("/#type/#{$scope.name}"))
      ), 1000
      #TODO save
    $scope.load = (name, fromtype = false) ->
      if !(name?) => name = $scope.name
      if !name => return
      type = if fromtype => "charttype" else "charts"
      chart = JSON.parse(localStorage.getItem("/#type/#name"))
      c = $scope.chart
      c.code.content = chart.code
      c.doc.content = chart.doc
      c.style.content = chart.style
      c.configs = chart.config
      c.dimensions = chart.dimension
      $scope.desc = chart.desc
      $scope.tags = chart.tags
      datasets = {}
      for item in data-service.datasets => 
        datasets[item.key] = item
        item.toggle = false
      for k,dim of chart.dimension =>
        fields = dim.fields
        dim.fields = []
        for f in fields
          $scope.chart.setdim f, {}, dim
          if datasets[f.dataset] => datasets[f.dataset].toggle = true
      c.render!
    $scope.datacreate = -> 
      $scope.showDataCreateModal = !!!$scope.showDataCreateModal
    if window.location.search =>
      ret = /[?&]name=([^&#]+)/.exec(that)
      if ret =>
        $scope.name = ret.1
        ret = /[?&]type=([^&#]+)/.exec(window.location.search)
        fromtype = if ret and ret.1 == "true" => true else false
        $scope.load $scope.name, fromtype
  ..controller \mychart, <[$scope dataService]> ++ ($scope, data-service) ->
    # My Charts
    $scope.mycharts = []
    list = JSON.parse(localStorage.getItem("/list/charts")) or []
    $scope.mycharts = list.map ->
      chart = JSON.parse(localStorage.getItem("/charts/#it"))
    .filter(->it)

    $scope.goto = (chart) ->
      window.location.href = "/chart.html?name=#{chart.name}"
