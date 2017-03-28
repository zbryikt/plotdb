angular.module \plotDB
  ..controller \plEditorNew,
  <[$scope $http $timeout $interval $sce plConfig IOService dataService chartService paletteService themeService plNotify eventBus permService license]> ++ ($scope,$http,$timeout,$interval,$sce,plConfig,IOService,data-service,chart-service,paletteService,themeService,plNotify,eventBus,permService,license) ->
    $scope.plotdb-domain = "#{plConfig.urlschema}#{plConfig.domain}" #"#{plConfig.urlschema}#{plConfig.domainIO}"
    $scope.plotdb-domainIO = "#{plConfig.urlschema}#{plConfig.domainIO}"
    $scope.editor = CodeMirror.fromTextArea(document.getElementById('editor-textarea'), {
      lineNumbers: true,
      mode: "javascript",
      theme: "default"
    });
    $scope.sharePanel = do
      embed: do
        width: \100%
        height: \600px
        widthRate: 4
        heightRate: 3
      init: ->
        $scope.$watch 'chart.key', ~>
          if $scope.chart => @link = "#{$scope.plotdb-domainIO}/v/chart/#{$scope.chart.key}"
        (eventsrc) <~ <[#edit-sharelink-btn #edit-sharelink #edit-embedcode-btn #edit-embedcode]>.map
        clipboard = new Clipboard eventsrc
        clipboard.on \success, ->
          $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
          setTimeout((->$(eventsrc).tooltip('hide')), 1000)
        clipboard.on \error, ->
          $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
          setTimeout((->$(eventsrc).tooltip('hide')), 1000)
        embedcode-generator = ~>
          link = @link
          [w,h] = [@embed.width, @embed.height]
          [wr,hr] = [@embed.widthRate, @embed.heightRate]
          ratio = (hr / (wr or hr or 1)) * 100
          if /^\d+$/.exec(w) => w = w + \px
          if /^\d+$/.exec(h) => h = h + \px
          if $scope.sharePanel.aspectRatio =>
            return [
              """<div style="width:100%"><div style="position:relative;height:0;overflow:hidden;"""
              """padding-bottom:#ratio%"><iframe src="#link" frameborder="0" allowfullscreen="true" """
              """style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe></div></div>"""
            ].join("")
          else =>
            return [
              """<iframe src="#link" width="#w" height="#h" """
              """allowfullscreen="true" frameborder="0"></iframe>"""
            ].join("")
        $scope.$watch 'sharePanel.embed', (~>
          @embedcode = embedcode-generator!
        ), true
        $scope.$watch 'sharePanel.aspectRatio', ~>
          @embedcode = embedcode-generator!
        $scope.$watch 'sharePanel.link', ~>
          @embedcode = embedcode-generator!
    $scope.sharePanel.init!


    $scope.editortheme = ->
      $scope.editortheme.val = it
      $scope.editor.setOption \theme, it
      document.cookie = "editortheme=#it"
    $scope.editortheme.val = (/editortheme=([^;].+?)(;|$)/.exec(document.cookie) or {}).1
    if !$scope.editortheme.val => $scope.editortheme.val = \default
    $scope.editortheme $scope.editortheme.val
    $scope.colorblind = do
      val: \normal
      vals: <[
        normal protanopia protanomaly deuteranopia deuteranomaly tritanopia
        tritanomaly achromatopsia achromatomaly
      ]>
      set: ->
        if !(it in @vals) => return
        @val = it
        document.getElementById(\editor-canvas).style <<< do
          "-webkit-filter": "url(\##it)"
          "filter": "url(\##it)"


    $scope.rwdtest = do
      val: \default
      vals: <[default QVGA HVGA Thumb Custom]>
      map: do
        default: [0,0]
        QVGA: [240, 320]
        HVGA: [320, 480]
        Thumb: [308, 229]
      custom: width: 640, height: 480
      init: -> $scope.$watch 'rwdtest.custom', (~>@set!), true
      set: ->
        if !(it in @vals) => it = @val
        @val = it
        #if !$scope.editor.fullscreen.toggled => $scope.editor.fullscreen.toggle!
        node = document.getElementById(\editor-canvas)
        canvas = node.querySelector(".inner")
        {width,height} = node.getBoundingClientRect!{width, height}
        if @val == \default =>
          [w,h] = <[100% 100%]>
          canvas.style <<< marginTop: 0, marginLeft: 0
        else
          if @val == \Custom => [w,h] = [@custom.width, @custom.height]
          else [w,h] = @map[@val]
          canvas.style <<< marginTop: ((height - h)/2) + "px", marginLeft: ((width - w)/2) + "px"
          [w,h] = [w,h].map(->"#{it}px")
        canvas.style <<< width: w, height: h
        canvas.style.boxShadow = '0 0 3px rgba(0,0,0,0.2)'
    $scope.rwdtest.init!

    $scope.code = do
      size: ''
      toggle-large: ->
        @size = if @size == 'lg' => '' else \lg
        $scope.canvas-resize!

    $scope.canvas-resize = ->
      $timeout (->
        left = Math.max.apply(null, Array.from(document.querySelectorAll '.editor-func-detail')
          .map(->
            if it.getAttribute(\class).split(' ').indexOf(\lg) >= 0  => return 0
            it.getBoundingClientRect!width
          )) + 100
        node = document.querySelector '#editor-canvas'
        node.style.left = "#{left}px"
        node = document.querySelector '.editor-ctrls'
        node.style.left = "#{left}px"
        $scope.rwdtest.set!
      ), 0

    $scope.$watch 'edfunc', ->
      if it == \download => $scope.download <<< format: '', ready: false
      $scope.canvas-resize!
    last-edcode = null
    build = ->
      value = $scope.editor.getValue()
      if $scope.chart => $scope.chart[$scope.edcode].content = value
      if last-edcode == $scope.edcode => reset $scope.chart
      last-edcode := $scope.edcode

    $scope.editor.on \change, build
    $scope.update-code = ->
      if $scope.chart => $scope.editor.getDoc!.setValue $scope.chart[$scope.edcode].content
    $scope.$watch 'edcode', (val) -> $scope.update-code!
    $scope.edcode = \code

    $scope.library = do
      hash: {}
      load: (list) ->
        if !list => list = $scope.{}chart.library or []
        tasks = list.map(-> [it, it.split '/']).filter(~> !@hash[it.0])
        Promise.all(for item in tasks =>
          ((item) ~> new Promise (res, rej) ~>
            url = item.1
            url = "/lib/#{url.0}/#{url.1}/index.#{if url.2 => that+'.' else ''}js"
            $http url: url, method: \GET
              .success (js) ~>
                bloburl = URL.createObjectURL new Blob [js], {type: \text/javascript}
                @hash[item.0] = bloburl
                res!
          ) item
        ) .then ~>
          ret = {}
          list.map ~> ret[it] = @hash[it]
          ret

    $scope.update-data = (data) ->
      [v for k,v of $scope.dimension].map -> it.fields = []
      for i from 0 til data.length =>
        if !data[i].bind or !$scope.dimension[data[i].bind] => continue
        $scope.dimension{}[data[i].bind].[]fields.push data[i]
      send-msg {
        type: \update-data
        data: $scope.dimension
      }
    eventBus.listen \dataset.changed, (data) ->
      $scope.update-data data
      $scope.data = data

    $scope.loadSampleData = ->
      send-msg { type: \get-sample-data }
    $scope.iframe = document.querySelector('#editor-canvas iframe')
    $scope.framewin = $scope.iframe.contentWindow
    send-msg = -> $scope.framewin.postMessage it, $scope.plotdb-domain

    $scope.download = do
      loading: false
      data: null
      init: ->
        $scope.$watch 'download.customSize', (v,o) ->
          if v == o => return
          if !v => $scope.rwdtest.set \default
          else
            $scope.rwdtest.set \Custom

      fetch: (format = \svg) ->
        @ <<< {format, loading: true, data: false, ready: false}
        @format = format
        @loading = true
        if format == \plotdb =>
          data = JSON.stringify($scope.chart)
          size = data.length
          url = URL.createObjectURL(new Blob [data], {type: 'application/json'})
          @ <<< do
            loading: false
            ready: true
            url: url
            size: size
            filename: "#{$scope.chart.name}.json"
        else => send-msg {type: \snapshot, format: format}
    $scope.download.init!

    dispatcher = (evt) ->
      if evt.data.type == \inited =>
        $scope.dimension = JSON.parse evt.data.dimension 
        $scope.dimkeys = [{name: k,multiple: v.multiple} for k,v of $scope.dimension]
      if evt.data.type == \sample-data =>
        $scope.data = data = evt.data.data
        eventBus.fire \dataset.update.fields, data, $scope.dimkeys
        $scope.update-data data
      if evt.data.type == \snapshot => $scope.$apply ->
        {payload, format} = evt.data
        ext = "png"
        if payload =>
          if /svg/.exec(format) =>
            size = payload.length
            url = URL.createObjectURL(new Blob [payload], {type: 'image/svg+xml'})
            ext = "svg"
          else if /png/.exec(format) =>
            bytes = atob(payload.split(\,).1)
            mime = payload.split(\,).0.split(\:).1.split(\;).0
            buf = new ArrayBuffer bytes.length
            ints = new Uint8Array buf
            for idx from 0 til bytes.length => ints[idx] = bytes.charCodeAt idx
            size = bytes.length
            url = URL.createObjectURL(new Blob [buf], {type: 'image/png'})

        $scope.download <<< do
          loading: false
          ready: (if payload => true else false)
          url: url
          size: size
          filename: "#{$scope.chart.name}.#{ext}"
    window.addEventListener \message, dispatcher, false
    init = (code) ->
      if typeof(code) == \number => plotdb.load code, (chart) ->
        $scope.chart = JSON.parse(chart._._chart)
        $scope.update-code!
        reset $scope.chart
    reset = (chart) ->
      $scope.iframe.src = "/dev/render.html"
      $scope.iframe.onload = ->
        $scope.library.load chart.library .then (library) ->
          send-msg {
            type: \init
            src: JSON.stringify(chart)
            library: library
          }
    init 2241

    $scope <<< do
      setting-panel: do
        tab: \publish
        init: ->
          $scope.permtype = window.[]permtype.1 or 'none'
          $scope.writable = permService.is-enough($scope.permtype, 'write')
          $scope.is-admin = permService.is-enough($scope.permtype, 'admin')
          #$scope.$watch 'chart.permission', $scope.setting-panel.permcheck, true
          #$scope.$watch 'theme.permission', $scope.setting-panel.permcheck, true
          $scope.$watch 'settingPanel.chart', ((cur, old) ~>
            for k,v of cur =>
              if !v and !old[k] => continue
              $scope.chart[k] = v
          ), true
          $scope.$watch 'chart.inherit', (~> @chart.inherit = it), true
          $scope.$watch 'chart.basetype', ~> @chart.basetype = it
          $scope.$watch 'chart.visualencoding', ~> @chart.visualencoding = it
          $scope.$watch 'chart.category', ~> @chart.category = it
          $scope.$watch 'chart.tags', ~> @chart.tags = it
          $scope.$watch 'chart.library', ~> @chart.library = it
        toggle: (tab) ->
          if tab => @tab = tab
          @toggled = !!!@toggled
        toggled: false
        chart: do
          basetype: null
          visualencoding: null
          category: null
          tags: null
          library: null
          inherit: null



    /*
    $scope.framewin.postMessage {
      type: \render
      chart: JSON.stringify(chart._.chart)
      library: library
    }, $scope.plotdb-domain
    */
    /*
    $timeout (->
      $scope.framewin.postMessage {
        type: \get-sample-data
      }, $scope.plotdb-domain
    ), 2000
    */

    /*
    plotdb.load 1008, (chart) ->
      $scope.chart = chart
      $scope.editor.getDoc!.setValue chart._.chart.code.content
      chart.config do
        yAxisShowDomain: false
      #chart.attach '#editor-canvas .inner'
      dimkeys = [k for k of chart._.chart.dimension]
      data = plotdb.chart.fields-from-dimension chart._.chart.dimension
      data.map (d,i) -> $scope.map[i] = d.bind
      console.log 'sample dataset', data
      console.log ">", dimkeys
      $scope.data = data
      eventBus.fire \dataset.update.fields, data, dimkeys
      eventBus.listen \dataset.changed, (data) ->
        console.log 'changed dataset', data
        ret = $scope.update-data chart, data
        chart.data ret, true
        $scope.data = data
    */
