angular.module \plotDB
  ..filter \tags, -> -> (it or "").split(\,)
  ..filter \length, -> -> [k for k of it].length
  ..service \chartService,
  <[$rootScope sampleChart IOService baseService]> ++
  ($rootScope, sampleChart, IOService, baseService) ->
    service = do
      sample: []
      link: (chart) -> "/chart/?k=#{chart.type.location}|#{chart.type.name}|#{chart.key}"
    object = ->
    object.prototype = do
      name: \untitled
      desc: null, tags: null,
      doc: {name: 'document', type: 'html', content: sampleChart.doc.content}
      style: {name: 'stylesheet', type: 'css', content: sampleChart.style.content}
      code: {name: 'code', type: 'javascript', content: sampleChart.code.content}
      config: {}
      dimension: {}
      assets: []
      thumbnail: null
      isType: false
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
            ret[k] = if v.[]fields.0 => that.[]data[i] else null
            #TODO need correct type matching
            if v.type.filter(->it.name == \Number).length => ret[name] = parseFloat(ret[name])
          @data.push ret

    chartService = baseService.derive \chart ,service, object
    chartService

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
        code:  lineWrapping: true, lineNumbers: true, mode: \javascript
        style: lineWrapping: true, lineNumbers: true, mode: \css
        doc:   lineWrapping: true, lineNumbers: true, mode: \xml
        objs: []
      chart: new chart-service.chart!
      canvas: do
        node: document.getElementById(\chart-renderer)
        window: document.getElementById(\chart-renderer).contentWindow

    $scope <<< do # Functions
      save: (astype = false) -> 
        if astype and @chart.type.name == \chart =>
          @chart.type.name = \charttype
          @chart.key = null
        @canvas.window.postMessage {type: \snapshot}, @plotdomain
      load: (type, key) -> chart-service.load type, key .then (ret) ~> @chart <<< ret
      delete: ->
        if !@chart.key => return
        (ret) <~ @chart.delete!then
        plNotify.send \success, "chart deleted"
        @chart = new chartService.chart!
        #TODO check future URL correctness
        setTimeout (-> window.location.href = "/chart/me.html"), 1000

      dimension: do
        bind: (event, dimension, field = {}) ->
          <~ field.update!then
          dimension.fields = [field]
          $scope.render!
        unbind: (event, dimension, field = {}) ->
          idx = dimension.fields.index-of(field)
          if idx < 0 => return
          dimension.fields.splice idx, 1
      reset: -> @render!
      render: (rebind = true) ->
        @chart.update-data!
        for k,v of @chart => if typeof(v) != \function => @chart[k] = v
        payload = JSON.parse(angular.toJson(@chart))
        # trigger a full reload of renderer in case any previous code ( such as timeout recursive )
        # and actually render it once loaded
        $scope.render <<< {payload, rebind}
        if !rebind => @canvas.window.postMessage {type: \render, payload, rebind}, @plotdomain
        else @canvas.window.postMessage {type: \reload}, @plotdomain
      render-async: (rebind = true)  ->
        if @render-async.handler => $timeout.cancel @render-async.handler
        @render-async.handler = $timeout (~>
          @render-async.handler = null
          @render rebind
        ), 500
      countline: ->
        <~ <[code style doc]>.map
        @chart[it].lines = @chart[it].content.split(\\n).length
        @chart[it].size = @chart[it].content.length

    $scope <<< do # Behaviors
      editor: do
        class: ""
        update: ->
          @class = [
            if @fullscreen.toggled => \fullscreen else ""
            @color.modes[@color.idx]
          ].join(" ")
        fullscreen: do
          toggle: ->
            @toggled = !!!@toggled
            $scope.editor.update!
          toggled: false
        color: do
          modes: <[normal dark]>
          idx: 0
          toggle: ->
            @idx = (@idx + 1) % (@modes.length)
            $scope.editor.update!
      share-panel: do
        toggle: -> @toggled = !!!@toggled
        toggled: false
        set-private: -> @is-public = false
        set-public: -> @is-public = true
      coloredit: do
        config: (v, idx) -> do
          class: \no-palette
          context: "context#idx"
          exclusive: true
          palette: [v.value]
      paledit: do #TODO should be moved to standalone controller
        ldcp: null, item: null
        init: ->
          @ldcp = new ldColorPicker null, {}, $('#palette-editor .editor .ldColorPicker').0
          @ldcp.on \change, ~> setTimeout ( ~> $scope.$apply ~> @update! ), 0
        update: -> if @item => @item.value = @ldcp.get-palette!
        toggled: false
        toggle: ->
          @toggled = !!!@toggled
          if !@toggled => @update!
        edit: (item) ->
          @item = item
          #TODO remove this later
          if Array.isArray(item.value) => item.value = {colors: item.value.map(->{hex:it})}
          @ldcp.set-palette item.value
          @toggled = true

      hid-handler: ->
        # Switch Panel by Alt-Enter
        switch-panel = ~>
          <~ setTimeout _, 0
          <~ $scope.$apply _
          temp = @vis
          if @vis == \preview and @lastvis => @vis = @lastvis
          else if @vis == \preview => @vis = \code
          else @vis = \preview
          @lastvis = temp
        $scope.codemirrored = (editor) -> $scope.codemirror.objs.push editor
        document.body.addEventListener \keydown, (e) -> 
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
            $scope.$apply -> switch-panel!

      check-param: ->
        if !window.location.search => return
        ret = /[?&]k=([^&#|]+)\|([^&#|]+)\|([^&#|]+)/.exec(window.location.search)
        if !ret => return
        [location,type,key] = ret[1,2,3]
        if type != \charttype => type = \chart
        $scope.load {name: type, location}, key
      assets: do
        read: (fobj) -> new Promise (res, rej) ~>
          name = if /([^/]+\.?[^/.]*)$/.exec(fobj.name) => that.1 else \unnamed
          type = \unknown
          file = $scope.chart.add-file name, type, null
          fr = new FileReader!
          fr.onload = ->
            result = fr.result
            idx = result.indexOf(\;)
            type = result.substring(5,idx)
            content = result.substring(idx + 8)
            file <<< {type, content}
            $scope.$apply-async -> file <<< {type, content}
            res file
          fr.readAsDataURL fobj
        handle: (files) -> for file in files => @read file
        node: null
        init: ->
          @node = $('#code-editor-assets input')
            ..on \change, ~> @handle @node.0.files
      monitor: ->
        @assets.init!
        @$watch 'vis', (vis) ~>
          # codemirror won't update if it's not visible. so wait a little
          # refresh will reset cursor which scroll to the top.
          # so we only want to refresh once.
          setTimeout (~>
            @codemirror.objs.map (cm) ->
              ret = [[k,v] for k,v of $scope.codemirror].filter(->it.1.mode == cm.options.mode).0
              if !ret or !vis.starts-with(ret.0) => return
              setTimeout (~> cm.focus!), 10
              if ret.1.refreshed => return
              cm.refresh!
              #WORKAROUND: one refresh only brings partial content
              # use use another refresh to remedy this
              setTimeout (~> cm.refresh!), 0
              ret.1.refreshed = true # make it happened only once.
          ), 0
        @$watch 'chart.doc.content', ~> @countline!
        @$watch 'chart.style.content', ~> @countline!
        @$watch 'chart.code.content', ~> @countline!
        @$watch 'chart.doc.content', ~> @render-async!
        @$watch 'chart.style.content', ~> @render-async!
        @$watch 'chart.code.content', (code) ~>
          if @communicate.parse-handler => $timeout.cancel @communicate.parse-handler
          @communicate.parse-handler = $timeout (~>
            @communicate.parse-handler = null
            @canvas.window.postMessage {type: \parse, payload: code}, @plotdomain
          ), 500
        @$watch 'chart.config', (~> @render-async false), true
      communicate: -> # talk with canvas window
        ({data}) <~ window.addEventListener \message, _, false
        if !data or typeof(data) != \object => return
        if data.type == \error =>
          $scope.$apply -> $scope.error = data.payload
        else if data.type == \alt-enter => $scope.$apply -> $scope.vis = 'code'
        else if data.type == \snapshot =>
          #TODO need sanity check
          @chart.thumbnail = data.payload
          @chart.save!then (ret) -> 
            plNotify.send \success, "chart saved"
            $scope.$apply -> $scope.chart <<< ret
            link = chartService.link $scope.chart
            if !window.location.search => window.location.href = link
        else if data.type == \parse =>
          {config,dimension} = JSON.parse(data.payload)
          for k,v of @chart.dimension => if dimension[k]? => dimension[k].fields = v.fields
          for k,v of @chart.config => if config[k]? => config[k].value = v.value
          for k,v of config => if !(v.value?) => v.value = v.default
          @chart <<< {config, dimension}
          $scope.render!
        else if data.type == \loaded =>
          if $scope.render.payload =>
            payload = $scope.render.payload
            rebind = $scope.render.rebind
            @canvas.window.postMessage {type: \render, payload, rebind}, @plotdomain
            $scope.render.payload = null
          else
            @canvas.window.postMessage {type: \parse, payload: @chart.code.content}, @plotdomain
        else if data.type == \click =>
          if document.dispatchEvent
            event = document.createEvent \MouseEvents
            event.initEvent \click, true, true
            event.synthetic = true
            document.dispatchEvent event
          else
            event = document.createEventObject!
            event.synthetic = true
            document.fireEvent("onclick", event)
      init: ->
        @communicate!
        @hid-handler!
        @monitor!
        @check-param!
        @paledit.init!
    $scope.init!

  ..controller \mychart,
  <[$scope $http dataService chartService]> ++
  ($scope, $http, data-service, chart-service) ->
    (ret) <- chart-service.list!then
    <- $scope.$apply
    $scope.mycharts = ret
    $scope.goto = (chart) -> window.location.href = chartService.link chart
  ..controller \chartList,
  <[$scope $http dataService chartService]> ++
  ($scope, $http, data-service, chart-service) ->
    $scope.charttypes = []
    (ret) <- chart-service.list {name: \charttype, location: \any} .then
    $scope.charttypes = ret
