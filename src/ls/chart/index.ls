angular.module \plotDB
  ..filter \tags, -> -> (it or "").split(\,)
  ..filter \length, -> -> [k for k of it].length
  ..service \chartService,
  <[$rootScope sampleChart IOService baseService]> ++
  ($rootScope, sampleChart, IOService, baseService) ->
    service = do
      sample: []
      link: (chart) -> "/chart/?k=#{chart.type.location}|#{chart.type.name}|#{chart.key}"
      thumblink: (chart) -> "#{@sharelink chart}/thumb"
      #TODO better mechanism for switching domain ( dev, staging and production )
      #sharelink: (chart) -> "https://plotdb.com/v/chart/#{chart.key}"
      sharelink: (chart) -> "http://localhost/v/chart/#{chart.key}"
    object = ->
    object.prototype = do
      name: \untitled
      desc: null, tags: null
      theme: null
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
  <[$scope $http $timeout $interval dataService chartService paletteService themeService plNotify]> ++
  ($scope, $http, $timeout, $interval, data-service, chart-service, paletteService, themeService, plNotify) ->
    $scope <<< do # Variables
      theme: null
      showsrc: true
      vis: \preview
      lastvis: null
      plotdomain: \http://localhost/
      error: {msg: null, lineno: 0}
      codemirror: do
        #NOTE viewportMargin = Infinity might cause performance issue when file is large.
        code:  lineWrapping: true, lineNumbers: true, viewportMargin: Infinity, mode: \javascript
        style: lineWrapping: true, lineNumbers: true, viewportMargin: Infinity, mode: \css
        doc:   lineWrapping: true, lineNumbers: true, viewportMargin: Infinity, mode: \xml
        objs: []
      chart: new chart-service.chart!
      canvas: do
        node: document.getElementById(\chart-renderer)
        window: document.getElementById(\chart-renderer).contentWindow
    $scope <<< do # Functions
      save: (astype = false) ->
        # astype deprecated
        /*if astype and @chart.type.name == \chart =>
          #@chart.type.name = \charttype
          @chart.key = null*/
        @canvas.window.postMessage {type: \snapshot}, @plotdomain
      load: (type, key) ->
        chart-service.load type, key
          .then (ret) ~> @chart <<< ret
          .catch (ret) ~> window.location.href = window.location.pathname
      delete: ->
        if !@chart.key => return
        (ret) <~ @chart.delete!then
        plNotify.send \success, "chart deleted"
        @chart = new chartService.chart!
        #TODO check future URL correctness
        setTimeout (-> window.location.href = "/chart/me.html"), 1000
      migrate: ->
        if !@chart.key => return
        cloned = @chart.clone!
        cloned.type.location = (if @chart.type.location == \local => \server else \local)
        <~ cloned.save!then
        <~ @chart.delete!then
        $scope.chart = cloned
        window.location.href = chartService.link $scope.chart
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
        payload = JSON.parse(angular.toJson({theme: @theme, chart: @chart}))
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
      download: do
        prepare: -> <[svg png plotdb]>.map (n) ~>
          setTimeout (~> $scope.$apply ~> [@[n].url = '', @[n]!]), 300
        svg: -> $scope.canvas.window.postMessage {type: \getsvg}, $scope.plotdomain
        png: -> $scope.canvas.window.postMessage {type: \getpng}, $scope.plotdomain
        plotdb: ->
          payload = angular.toJson($scope.chart)
          @plotdb.url = URL.createObjectURL new Blob [payload], {type: \application/json}
          @plotdb.size = payload.length

    $scope <<< do # Behaviors
      themes:
        list: themeService.sample
        set: -> $scope.theme = it
      editor: do
        class: ""
        focus: ->
          # codemirror won't update if it's not visible. so wait a little
          # refresh will reset cursor which scroll to the top.
          # so we only want to refresh once.
          setTimeout (~>
            $scope.codemirror.objs.map (cm) ->
              ret = [[k,v] for k,v of $scope.codemirror].filter(->it.1.mode == cm.options.mode).0
              if !ret or !$scope.vis.starts-with(ret.0) => return
              setTimeout (~> cm.focus!), 10
              if ret.1.refreshed => return
              cm.refresh!
              #WORKAROUND: one refresh only brings partial content
              # use use another refresh to remedy this
              ret.1.refreshed = true # make it happened only once.
              <~ setTimeout _, 0
              cm.refresh!
              # refresh will eat error highlight. re-add it
              # should this be refactored?
              if $scope.error.lineno =>
                $("\#code-editor-code .CodeMirror-code > div:nth-of-type(#{$scope.error.lineno})").addClass \error

          ), 0

        update: ->
          @class = [
            if @fullscreen.toggled => \fullscreen else ""
            if @vis != 'preview' => \active else ""
            @color.modes[@color.idx]
          ].join(" ")
        fullscreen: do
          toggle: ->
            @toggled = !!!@toggled
            $scope.editor.update!
            $scope.editor.focus!
          toggled: false
        color: do
          modes: <[normal dark]>
          idx: 0
          toggle: ->
            @idx = (@idx + 1) % (@modes.length)
            $scope.editor.update!
      setting-panel: do
        toggle: -> @toggled = !!!@toggled
        toggled: false

      share-panel: do
        social: do
          facebook: null
        is-forkable: ->
          perms = $scope.chart.permission.[]value
          forkable = !!perms.filter(->it.perm == \fork and it.switch == \public).length
        init: ->
          (eventsrc) <~ <[#chartedit-sharelink #chartedit-embedcode]>.map
          clipboard = new Clipboard eventsrc
          clipboard.on \success, ->
            $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          clipboard.on \error, ->
            $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          $scope.$watch 'sharePanel.link', ~>
            @embedcode = "<iframe src=\"#it\"><iframe>"
            @thumblink = chartService.thumblink $scope.chart
            fbobj = do
              #TODO verify
              app_id: \1546734828988373
              display: \popup
              caption: $scope.chart.name
              picture: @thumblink
              link: @link
              name: $scope.chart.name
              redirect_uri: \http://plotdb.com/
              description: $scope.chart.desc or ""
            @social.facebook = ([ "https://www.facebook.com/dialog/feed?" ] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of fbobj]
            ).join(\&)

            pinobj = do
              url: @link
              media: @thumblink
              description: $scope.chart.desc or ""
            @social.pinterest = (["https://www.pinterest.com/pin/create/button/?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of pinobj]
            ).join(\&)

            emailobj = do
              subject: "plotdb: #{$scope.chart.name}"
              body: "#{$scope.chart.desc} : #{@link}"
            @social.email = (["mailto:?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of emailobj]
            ).join(\&)

            linkedinobj = do
              mini: true
              url: @link
              title: "#{$scope.chart.name} on PlotDB"
              summary: $scope.chart.desc
              source: "plotdb.com"
            @social.linkedin = (["http://www.linkedin.com/shareArticle?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of linkedinobj]
            ).join(\&)

            twitterobj = do
              url: @link
              text: "#{$scope.chart.name} - #{$scope.chart.desc or ''}"
              hashtags: "dataviz,chart,visualization"
              via: "plotdb"
            @social.twitter = (["http://twitter.com/intent/tweet?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of twitterobj]
            ).join(\&)

          $scope.$watch 'sharePanel.forkable', ~>
            forkable = @is-forkable!
            if forkable != @forkable and @forkable? =>
              $scope.chart.permission.value = if it => [{switch: \public, perm: \fork}] else []
              @save-hint = true
          $scope.$watch 'chart.permission.value', (~>
            forkable = @is-forkable!
            if @forkable != forkable and @forkable? => @save-hint = true
            @forkable = forkable
          ), true
        save-hint: false
        embedcode: ""
        link: ""
        toggle: ->
          if @init => @init!
          @init = null
          @toggled = !!!@toggled
          @save-hint = false
        toggled: false
        is-public: -> ("public" in $scope.chart.permission.switch)
        set-private: ->
          $scope.chart.{}permission.switch = <[private]>
          @save-hint = true
        set-public: ->
          $scope.chart.{}permission.switch = <[public]>
          @save-hint = true
      coloredit: do
        config: (v, idx) -> do
          class: \no-palette
          context: "context#idx"
          exclusive: true
          palette: [v.value]
      paledit: do #TODO should be moved to standalone controller
        convert: -> it.map(->{id: it.key, text: it.name, data: it.colors})
        ldcp: null, item: null
        init: ->
          @ldcp = new ldColorPicker null, {}, $('#palette-editor .editor .ldColorPicker').0
          @ldcp.on \change, ~> setTimeout ( ~> $scope.$apply ~> @update! ), 0
          @list = [{ text: 'Default', children: @convert paletteService.sample }]
          $(\#pal-select)
            ..select2 icon-pal-select-config = do
              allowedMethods: <[updateResults]>
              templateResult: (state) ->
                if !state.data => return state.text
                color = [("<div class='color' "+
                  "style='background:#{c.hex};width:#{100/state.data.length}%'"+
                  "></div>") for c in state.data
                ].join("")
                $("<div class='palette select'><div class='name'>#{state.text}</div>"+
                  "<div class='palette-color'>#color</div></div>")
              data: @list
            ..on \select2:closing, (e) ~>
              for item in @list =>
                ret = item.children.filter(~>it.id == $(e.target)val!).0
                if ret => break
              if !ret => return
              @ldcp.set-palette {colors: ret.data}

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

      switch-panel: ->
        <~ setTimeout _, 0
        <~ $scope.$apply _
        temp = @vis
        if @vis == \preview and (!@lastvis or @lastvis == \preview) => @vis = \code
        else if @vis == \preview => @vis = @lastvis
        else @vis = \preview
        @lastvis = temp

      hid-handler: ->
        # Switch Panel by alt-enter
        $scope.codemirrored = (editor) -> $scope.codemirror.objs.push editor
        document.body.addEventListener \keydown, (e) ~>
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
            $scope.$apply ~> @switch-panel!

      check-param: ->
        if !window.location.search => return
        ret = /[?&]k=([^&#|]+)\|([^&#|]+)\|([^&#|]+)/.exec(window.location.search)
        if !ret => return
        [location,type,key] = ret[1,2,3]
        if type != \charttype => type = \chart
        $scope.load {name: type, location}, key
      assets: do
        measure: ->
          $scope.chart.assets.size = $scope.chart.assets.map(-> it.content.length ).reduce(((a,b)->a+b),0)
        preview: (file) ->
          @preview.toggled = true
          datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
          iframe = document.createElement("iframe")
          $('#assets-preview .iframe').0.innerHTML = "<iframe></iframe>"
          $('#assets-preview .iframe iframe').0.src = datauri
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
            size = $scope.chart.assets.map(->(it.content or "").length).reduce(((a,b)->a+b),0) + content.length
            if size > 3000000 => $scope.$apply ->
              plNotify.alert "Assets size limit (3MB) exceeded. won't upload."
              $scope.chart.remove-file file
              return
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
        @$watch 'vis', (vis) ~> $scope.editor.focus!
        @$watch 'chart.assets', (~> @assets.measure!), true
        @$watch 'chart.doc.content', ~> @countline!
        @$watch 'chart.style.content', ~> @countline!
        @$watch 'chart.code.content', ~> @countline!
        @$watch 'chart.doc.content', ~> @render-async!
        @$watch 'chart.style.content', ~> @render-async!
        @$watch 'theme', (theme) ~>
          @render-async!
          @chart.theme = if theme => theme.key else null
        @$watch 'chart.theme', (key) ~>
          @theme = @themes.list.filter(-> it.key == key).0
        @$watch 'chart.code.content', (code) ~>
          if @communicate.parse-handler => $timeout.cancel @communicate.parse-handler
          @communicate.parse-handler = $timeout (~>
            @communicate.parse-handler = null
            @canvas.window.postMessage {type: \parse, payload: code}, @plotdomain
          ), 500
        @$watch 'chart.config', ((n,o) ~>
          ret = !!([[k,v] for k,v of n]
            .filter(([k,v]) -> !o[k] or (v.value != o[k].value))
            .map(->v.rebindOnChange)
            .filter(->it).length)
          @render-async ret
        ), true
        @$watch 'chart.key', (~> @share-panel.link = chartService.sharelink @chart)
      communicate: -> # talk with canvas window
        ({data}) <~ window.addEventListener \message, _, false
        <~ $scope.$apply
        if !data or typeof(data) != \object => return
        if data.type == \error =>
          $('#code-editor-code .CodeMirror-code > .error').removeClass \error
          $scope.error.msg = data.{}payload.msg or ""
          $scope.error.lineno = data.{}payload.lineno or 0
          if $scope.error.lineno =>
            $(".CodeMirror-code > div:nth-of-type(#{$scope.error.lineno})").addClass \error
        else if data.type == \alt-enter => $scope.switch-panel!
        else if data.type == \snapshot =>
          #TODO need sanity check
          if data.payload => @chart.thumbnail = data.payload
          #TODO anonymouse handling
          if !$scope.user.data or !$scope.user.data.key => return $scope.auth.toggle true
          if @chart.owner != $scope.user.data.key =>
            @chart <<< {key: null, owner: null, permission: chartService.chart.prototype.permission}
          refresh = if !@chart.key => true else false
          (ret) <~ @chart.save!then
          $scope.$apply -> plNotify.send \success, "chart saved"
          #$scope.chart <<< ret
          link = chartService.link $scope.chart
          if refresh or !window.location.search => window.location.href = link
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
        else if data.type == \getsvg =>
          if !data.payload => return $scope.download.svg.url = '#'
          $scope.download.svg.url = URL.createObjectURL(new Blob [data.payload], {type: 'image/svg+xml'})
          $scope.download.svg.size = data.payload.length
        else if data.type == \getpng =>
          if !data.payload => return $scope.download.png.url = '#'
          bytes = atob(data.payload.split(\,).1)
          mime = data.payload.split(\,).0.split(\:).1.split(\;).0
          if mime != 'image/png' => return $scope.download.png.url = '#'
          buf = new ArrayBuffer bytes.length
          ints = new Uint8Array buf
          for idx from 0 til bytes.length => ints[idx] = bytes.charCodeAt idx
          $scope.download.png.url = URL.createObjectURL(new Blob [buf], {type: 'image/png'})
          $scope.download.png.size = bytes.length
      field-agent: do
        data: null
        drag: do
          ging: false
          start: -> @ging = true
          end: -> @ging = false
        set-proxy: (e,data) ->
          if @drag.ging => return
          [@data,node] = [data,e.target]
          while true
            if node.getAttribute("class").indexOf('data-field') >=0 => break
            node = node.parentNode
            if node.nodeName.toLowerCase! == \body => return
          <- setTimeout _, 0
          box = node.getBoundingClientRect!
          box2 = node.parentNode.parentNode.getBoundingClientRect!
          scroll = left: document.body.scrollLeft, top: document.body.scrollTop
          $(\#field-agent).css do
            top: "#{box.top - box2.top + 60}px"
            left: "#{box.left - box2.left}px"
            width: "#{box.width}px"
            height: "#{box.height}px"

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
  <[$scope $http IOService dataService chartService]> ++
  ($scope, $http, IO-service, data-service, chart-service) ->
    $scope.charts = []
    (ret) <- Promise.all [
      new Promise (res, rej) -> IO-service.aux.list-locally {name: \chart}, res, rej
      new Promise (res, rej) -> IO-service.aux.list-remotely {name: \chart}, res, rej, "q=all"
    ] .then
    $scope.$apply -> $scope.charts = ( ret.0 ++ ret.1 )
