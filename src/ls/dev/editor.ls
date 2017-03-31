angular.module \plotDB
  ..controller \plEditorNew,
  <[$scope $http $timeout $interval $sce plConfig IOService dataService chartService paletteService themeService plNotify eventBus permService license]> ++ ($scope,$http,$timeout,$interval,$sce,plConfig,IOService,data-service,chart-service,paletteService,themeService,plNotify,eventBus,permService,license) ->
    $scope.service = chart-service
    $scope.plotdb-domain = "#{plConfig.urlschema}#{plConfig.domain}" #"#{plConfig.urlschema}#{plConfig.domainIO}"
    $scope.plotdb-domainIO = "#{plConfig.urlschema}#{plConfig.domainIO}"
    $scope.editor = CodeMirror.fromTextArea(document.getElementById('editor-textarea'), {
      lineNumbers: true,
      mode: "javascript",
      theme: "default"
    });

    $scope.update-config = (config, rebind = false) -> 
      payload = (config or $scope.chart.config) #{}
      #for k,v of (config or $scope.chart.config) => payload[k] = v.value or v.default
      send-msg {type: \set-config, config: payload, rebind}
    $scope.local = do
      get: -> new Promise (res, rej) ~>
        @promise = {res, rej}
        send-msg {type: \get-local}

    $scope._save = ->
      if @save.pending => return
      @save.pending = true
      if !$scope.writable and $scope.chart.owner != $scope.user.data.key =>
        parent-key = (if @target!._type.location == \server => @target!.key else null)
        # could be : <[code document stylesheet assets]>. config
        $scope.target <<< key: null, owner: null, inherit: <[]>
        if !$scope.chart.permission => $scope.chart.permission = {switch: \publish, list: []}
        if parent-key => $scope.chart <<< {parent: parent-key}
      refresh = if !$scope.chart.key => true else false
      if $scope.chart.dimension => $scope.chart.dimlen = [k for k of $scope.chart.dimension or {}].length
      data = null
      @local.get!
        .then (local) ~>
          @chart.local = local
          data := @chart.data # prevent data to be sent
          @chart.data = null
          new chart-service.chart(@chart).save!
        .finally ~>
          @save.pending = false
          eventBus.fire \loading.dimmer.off
        .then (ret) ~>
          @chart.data = data
          <~ @$apply
          plNotify.send \success, "saved"
          if refresh => window.location.href = @service.link @chart
        .catch (err) ~> @$apply ~>
          if err.2 == 402 =>
            eventBus.fire \quota.widget.on
            plNotify.send \danger, "Failed: Quota exceeded"
          else
            plNotify.aux.error.io \save, @type, err
            console.error "[save #name]", err

    $scope.save = ->
      if !$scope.user.authed! => return $scope.auth.toggle true
      if @save.pending => return
      eventBus.fire \loading.dimmer.on
      send-msg type: \save
    $scope.sharePanel = do
      embed: do
        width: \100%
        height: \600px
        widthRate: 4
        heightRate: 3
      init: ->
        $scope.$watch 'chart.key', ~>
          if $scope.chart => @link = $scope.service.sharelink $scope.chart
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

    $scope.edfunc-set = -> $scope.edfunc = it
    $scope.edfunc-toggle = -> $scope.edfunc = if $scope.edfunc == it => '' else it
    $scope.$watch 'edfunc', ->
      if it == \download => $scope.download <<< format: '', ready: false
      if it == \editor => $scope.editor.focus!
      $scope.canvas-resize!
    last-edcode = null
    build = ->
      value = $scope.editor.getValue()
      if $scope.chart => $scope.chart[$scope.edcode].content = value
      if last-edcode == $scope.edcode => reset $scope.chart
      last-edcode := $scope.edcode

    $scope.editor.on \change, build
    $scope.update-code = ->
      if $scope.chart =>
        $scope.editor.getDoc!.setValue $scope.chart[$scope.edcode].content
        $scope.editor.setOption \mode, $scope.chart[$scope.edcode].type
        $scope.editor.focus!
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
      payload = evt.data
      if evt.data.type == \click =>
        if document.dispatchEvent =>
          event = document.createEvent \MouseEvents
          event.initEvent \click, true, true
          event.synthetic = true
          document.dispatchEvent event
        else
          event = document.createEventObject!
          event.synthetic = true
          document.fireEvent("onclick", event)
      if evt.data.type == \local-data =>
        $scope.local.data = payload.data
        res = $scope.local.{}promise.res
        $scope.local.promise = null
        if res => res payload.data
      if payload.type == \save =>
        if payload.payload => $scope.chart.thumbnail = payload.data
        $scope._save!
      if payload.type == \inited =>
        $scope.dimension = JSON.parse payload.dimension 
        new-config = JSON.parse payload.config
        [[k,v] for k,v of new-config].map -> it.1.value = $scope.chart.config[it.0].value
        $scope.chart.config = new-config
        $scope.$apply -> $scope.config-hash.update!
        $scope.dimkeys = [{name: k,multiple: v.multiple} for k,v of $scope.dimension]
      if payload.type == \sample-data =>
        $scope.data = data = payload.data
        eventBus.fire \dataset.update.fields, data, $scope.dimkeys
        $scope.update-data data
      if payload.type == \snapshot => $scope.$apply ->
        {data, format} = payload
        ext = "png"
        if data =>
          if /svg/.exec(format) =>
            size = data.length
            url = URL.createObjectURL(new Blob [data], {type: 'image/svg+xml'})
            ext = "svg"
          else if /png/.exec(format) =>
            bytes = atob(data.split(\,).1)
            mime = data.split(\,).0.split(\:).1.split(\;).0
            buf = new ArrayBuffer bytes.length
            ints = new Uint8Array buf
            for idx from 0 til bytes.length => ints[idx] = bytes.charCodeAt idx
            size = bytes.length
            url = URL.createObjectURL(new Blob [buf], {type: 'image/png'})

        $scope.download <<< do
          loading: false
          ready: (if data => true else false)
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
    init 2243

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

    $scope.paledit = do #TODO should be moved to standalone controller
        convert: -> it.map(->{id: it.key or "#{Math.random!}", text: it.name, data: it.colors})
        ldcp: null, item: null
        paste: null
        init: ->
          @ldcp = new ldColorPicker null, {}, $('#palette-editor .editor .ldColorPicker').0
          @ldcp.on \change-palette, ~> setTimeout ( ~> $scope.$apply ~> @update! ), 0
          @sample = paletteService.sample
          @list = []
          $(\#pal-select)
            ..select2 do
              ajax: do
                url: \/d/palette
                dataType: \json
                delay: 250
                data: (params) -> {offset: (params.page or 0)* 20, limit: 20}
                processResults: (data, params) ~>
                  params.page = params.page or 0
                  if params.page == 0 => @list = data = @sample ++ data
                  else @list = @list ++ data
                  return {
                    results: data.map(->{id: it.key, text: it.name, data: it.colors})
                    pagination: { more: data.length >= 20}
                  }
              allowedMethods: <[updateResults]>
              escapeMarkup: -> it
              minimumInputLength: 0
              templateSelection: -> return it.text + "<small class='grayed'> (" + it.id + ")</small>"
              templateResult: (state) ->
                if !state.data => return state.text
                color = [("<div class='color' "+
                  "style='background:#{c.hex};width:#{100/state.data.length}%'"+
                  "></div>") for c in state.data
                ].join("")
                $("<div class='palette select'><div class='name'>#{state.text}</div>"+
                  "<div class='palette-color'>#color</div></div>")
                return "<div class='palette select'><div class='name'>#{state.text}</div>"+
                  "<div class='palette-color'>#color</div></div>"

            ..on \select2:closing, (e) ~>
              key = $(e.target)val!
              ret = @list.filter(-> it.key ~= key).0

              $scope.$apply ~> @item.value = JSON.parse(JSON.stringify(ret))
              @ldcp.set-palette @item.value
          $scope.$watch 'paledit.paste', (d) ~>
            try
              result = JSON.parse(d)
              if Array.isArray(result) => @ldcp.set-palette {colors: result.map(->{hex: it})}
            catch e
              console.log e
              $scope.paledit.paste = ''
        update: -> if @item =>
          [src,des,pairing] = [@item.value, @ldcp.get-palette!, []]
          for i from 0 til des.colors.length =>
            d = des.colors[i]
            for j from 0 til src.colors.length =>
              s = src.colors[j]
              if s.hex != d.hex => continue
              pairing.push [s, d, Math.abs(i - j)]
          pairing.sort (a,b) -> a.2 - b.2
          for pair in pairing =>
            if pair.0.pair or pair.1.pair => continue
            pair.0.pair = pair.1
            pair.1.pair = pair.0
          unpair = [src.colors.filter(->!it.pair), des.colors.filter(->!it.pair)]
          for i from 0 til Math.min(unpair.0.length, unpair.1.length) => unpair.1[i].pair = unpair.0[i]
          src.colors = des.colors.map -> if it.pair => it.pair <<< {hex: it.hex} else it
          src.colors.forEach -> delete it.pair
          @paste = null
          $scope.update-config $scope.chart.config

        toggled: false
        toggle: ->
          @toggled = !!!@toggled
          if !@toggled => @update!
        edit: (item) ->
          @item = item
          @ldcp.set-palette item.value
          @toggled = true
    $scope.paledit.init!

    $scope.coloredit = do
      idx: 0
      config: (v) ->
        do
          class: "no-palette text-input top"
          context: "context-#{@idx++}"
          exclusive: true
          palette: [v.value]

    $scope.config-hash = do
      value: {}
      update: (n,o)->
        @value = {}
        if !$scope.chart => return
        n = n or $scope.chart.config
        if !n => return
        for k,v of n => @value{}[v.category or 'Other'][k] = v
        ret = !!([[k,v] for k,v of n]
          .filter(([k,v]) -> !o or !o[k] or (v.value != o[k].value))
          .map(->(it.1 or {}).rebindOnChange)
          .filter(->it).length)
        $scope.update-config $scope.chart.config, ret
      init: -> $scope.$watch 'chart.config', ((n,o) ~> @update(n,o)), true
    $scope.config-hash.init!
