angular.module \plotDB
  ..controller \plChartEditor,
  <[$scope $http $timeout plConfig chartService paletteService plNotify eventBus permService initWrap license]> ++ 
   ($scope,$http,$timeout,plConfig,chart-service,paletteService,plNotify,eventBus,permService,initWrap,license) ->
    # communication between renderer and editor
    initWrap = initWrap!
    dispatcher = initWrap do
      handlers: {}
      register: (name, handler) -> @handlers[][name].push(handler)
      handle: (evt) -> (@handlers[evt.data.type] or []).map -> it evt.data
      init: -> window.addEventListener \message, ((e)~> $scope.$apply ~> @handle e), false

    # fire click to close popup from canvas to host window
    dispatcher.register \click, ->
      if document.dispatchEvent =>
        event = document.createEvent \MouseEvents
        event.initEvent \click, true, true
        event.synthetic = true
        document.dispatchEvent event
      else
        event = document.createEventObject!
        event.synthetic = true
        document.fireEvent("onclick", event)
    # fire keydown from within iframe
    dispatcher.register \keydown, ({event: e}) ->
      if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) => $scope.panel.switch!

    # hints
    $scope.hint.hide = {}
    # modals. check directive 'chartModal' for more methods
    $scope.chartModal = name: {}
    $scope.chartModal.assets = initWrap do
      init: ->
      measure: ->
        $scope.chart.obj.[]assets.size = $scope.chart.obj.assets.map(-> it.content.length ).reduce(((a,b)->a+b),0)
      download: url: null, name: null
      remove: (f) -> 
        assets = $scope.chart.obj.assets or []
        idx = assets.indexOf f
        assets.splice idx, 1
        $scope.chart.reset!
      add: (f) ->
        assets = $scope.chart.obj.assets or []
        assets.push f
      preview: (file) ->
        @node = document.querySelector('#assets-preview iframe')
        @download.url = URL.createObjectURL(new Blob [file.content], {type: file.type})
        @download.name = file.name
        @preview.toggled = true
        datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
        @node.src = datauri
      read: (list) -> new Promise (res, rej) ~>
        deny = []
        for i from 0 til list.length =>
          item = list[i]
          name = if /([^/]+\.?[^/.]*)$/.exec(item.file.name) => that.1 else \unnamed
          type = item.file.type
          result = item.result
          idx = result.indexOf(\;)
          content = result.substring(idx + 8)
          size = $scope.chart.obj.[]assets.map(->(it.content or "").length).reduce(((a,b)->a+b),0) + content.length
          if size > 3000000 =>
            deny.push name
            continue
          $scope.chartModal.assets.add {name, type, content}
        if deny.length => plNotify.alert "Following assets exceed the size limit 3MB, and won't be uploaded: #{deny.join(\,)}"
      handle: (files) ->
        Promise.all [@read(file) for file in files]
          .then -> $scope.render-async!
          .catch -> console.log it
      node: null

    # ui controller
    $scope.panel = initWrap do
      init: ->
        width = document.body.getBoundingClientRect!width
        if width < 881 =>
          @size.value <<< dataset: 'full', editor: 'full'
          @size.doc = 'sm'
        $scope.$watch 'panel.tab', (n,o) -> 
          if n == o => return
          if n == \download => $scope.download.clear!
          if o == \editor => #$scope.editor.focus!
          $scope.canvas.resize!
        $scope.$watch 'panel.size.value', (->  $scope.canvas.resize!), true
        document.body.addEventListener \keydown, (e) ~> $scope.$apply ~>
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) => @switch!
      switch: -> @set (if @tab != \editor => \editor else ''), true
      tab: 'data'
      set: (v,f) -> @tab = if !f and @tab == v => '' else v
      size: do
        set: (panel, size) ->
          @value[panel] = if @value[panel] == size => '' else size
        value: {}
        doc: ''


    # code editor. check directive 'codeeditor' for more methods
    $scope.editor = initWrap do
      init: ->
      tab: do
        value: 'code', old-value: 'code'
        choices: <[code style doc]>
        set: ->
          @old-value = @value
          @value = it
          if @old-value != @value => $scope.editor.refresh!
      change: ->
        if @tab.old-value != @tab.value => return
        if $scope.chart.obj[@tab.value].content == it => return
        $scope.chart.obj[@tab.value].content = it
        $scope.chart.reset!
      refresh: -> 
        node = $scope.chart.obj[@tab.value]
        @update node.content, node.type

    # renderer. check directive 'viscanvas' for more methods
    $scope.canvas = canvas = initWrap do
      init: ->
        $scope.$watch 'editor.size.value', ~> @resize!
        dispatcher.register \inited, (payload) ~> @finish \load, payload
        dispatcher.register \rendered, ~> @finish \render
        $http do
          url: \/dev/editor/render.html
          method: \GET
        .success (d) ~> 
          @url = URL.createObjectURL new Blob [d], {type: \text/html}
        
      # chart: base object stored in database
      load: (chart) ->
        @canvas.iframe.src = if @url => that else  "/dev/editor/render.html"
        @canvas.iframe.onload = ~>
          $scope.chart.library.load chart.library .then (library) ~>
            @msg {
              type: \init
              chart: JSON.stringify(chart)
              library: library
            }
        @block \load
        
      render: (payload = {}) ->
        @msg({type: \render} <<< payload{data, config})
        @block \render

      resize: ->
        $timeout (->
          left = Math.max.apply(null, Array.from(document.querySelectorAll '.editor-func-detail')
            .map(->
              if it.getAttribute(\class).split(' ').indexOf(\full) >= 0  => return 0
              it.getBoundingClientRect!width
            )) + 100
          document.querySelector '#viscanvas' .style.left = "#{left}px"
          document.querySelector '.editor-ctrls' .style.left = "#{left}px"
          canvas.dimension.set!
        ), 0

    # chart
    $scope.chart = initWrap do
      src: null, obj: null
      dimension: {}
      init: ->
        $scope.$watch 'chart.config', ((n,o) ~>
          if angular.toJson(n.value) == angular.toJson(o.value) => return
          @config.parse(n.value,o.value)), true
        dispatcher.register \data.sample, ({data}) ~> @finish \sample, data
      animate: do
        toggle: (v) ->
          @toggled = if v? => v else !!!@toggled
          if @toggled and !@running =>
            @running = true
            @tick!
        running: false
        last: 0
        tick: (time) ->
          if time - @last > 2000 and @toggled =>
            @last = time
            $scope.chart.sample!then ~>
              $scope.chart.data.adopt it, false
              requestAnimationFrame(-> $scope.chart.animate.tick it)
          else requestAnimationFrame(-> $scope.chart.animate.tick it)
      sample: -> canvas.msg type: 'data.get(sample)'; @block \sample
      config: do
        value: null
        group: {}
        categorize: (n,o) ->
          @group = {}
          for k,v of n => @group{}[v.category or 'Other'][k] = v
        parse: (n,o) ->
          if !n => return
          rebind = !!([[k,v] for k,v of n]
            .filter(([k,v]) -> !o or !o[k] or (v.value != o[k].value))
            .map(->(it.1 or {}).rebindOnChange)
            .filter(->it).length)
          @update rebind
          @categorize n,o
        update: (rebind = false) ->
          #TODO rebind should be supported without reset. it's chart that need to be patched.
          if rebind => $scope.chart.reset!
          else canvas.msg {type: \config.set, config: (@value or {}), rebind}
        reset: ->
          for k,v of @value => v.value = v.default or v.value
          $scope.chart.reset!
      data: do
        bindmap: (dimension) ->
          bindmap = {}
          [[k,v] for k,v of dimension].map (d) ~> d.1.fields.map ~> if it.key => bindmap[it.key] = d.0
          bindmap
        adopt: (data, bykey = true) ->
          dimension = $scope.chart.dimension
          fields = data.fields or data
          bindmap = null
          if !bykey =>
            for k,v of dimension => v <<< fields: [], fieldName: []
            fields.map ~> if it.bind and dimension[it.bind] => dimension[it.bind].fields.push it
            @set fields
          else
            for k,v of dimension =>
              v.fields = v.fields.map((f) -> fields.filter(->it.key == f.key).0).filter(->it)
              v.fields.map -> it.bind = k
            bindmap = @bindmap dimension
          for k,v of dimension => v.fieldName = v.fields.map -> it.name
          dimkeys = [{name: k, displayname: v.name or k, desc: v.desc, multiple: !!v.multiple} for k,v of dimension]
          $scope.dataset.bind dimkeys, null #bindmap
          @update fields
        clear: -> eventBus.fire \sheet.data.clear
        sample: -> $scope.chart.sample!then ~> @adopt it, false
        set: (data) -> eventBus.fire \sheet.data.set, data
        get: -> @data
        autobind: (data, dim) ->
          search = (type, target, d = 0) ->
            if !type => return null
            if type in target => return type
            list = plotdb[type].basetype or []
            for i from 0 til list.length =>
              ret = search list[i].name, target, d + 1
              if ret => return ret
          md = (type, list = [])->
            list = list.map -> it.name or it
            if !type => return list.0
            type = type.name or type
            if !list.length => return type
            ret = search type, list
            if ret => return ret
            for i from 0 til list =>
              ret = search list[i], [type]
              if ret => return ret
            return null
          df = {}
          for i from 0 til data.length =>
            for k,v of dim =>
              ret = md data[i].datatype, v.type.map -> it.name
              if ret and (v.multiple or !df[k]) =>
                df[k] = if df[k] => that + 1 else 1
                data[i].bind = k
                break

        update: (data) ->
          if data.length and !data.filter(->it.bind).length =>
            @autobind data, $scope.chart.obj.dimension
            if data.filter(->it.bind) => @adopt data, false
            return
          @data = data
          dimension = $scope.chart.obj.dimension
          [v for k,v of dimension].map -> it.fields = []
          for i from 0 til data.length =>
            if !data[i].bind or !dimension[data[i].bind] => continue
            dimension{}[data[i].bind].[]fields.push data[i]
          for k,v of dimension => v.fieldName = v.fields.map(->it.name)
          #TODO check multiple entrance issue for initilization time
          canvas.msg type: \data.update, data: dimension

      reset: (chart) ->
        dataset-key = null
        Promise.resolve!
          .then ~>
            if !chart? and !@obj => return
            if chart => @ <<< src: JSON.stringify(chart), obj: chart
            if chart => $scope.editor.refresh!
            canvas.load(@obj)
          .then (payload) ~>
            new-config = JSON.parse payload.config
            cur-config = @config.value or (chart or {}).config or @obj.config or {}
            [[k,v] for k,v of new-config].map ~> if cur-config[it.0] => it.1.value = cur-config[it.0].value
            @config.value = new-config
            @config.categorize @config.value
            @dimension = JSON.parse payload.dimension
            if ![k for k of @dimension].length and chart => $scope.panel.tab = \style
            for k,v of @obj.dimension => if @dimension[k] =>
              @dimension[k] <<< @obj.dimension[k]{fields, fieldName}
            @obj.dimension = @dimension
            $scope.dataset.grid.isClear!
          .then (v) ~>
            if v => 
              dataset-key := [{k,v} for k,v of @dimension].map(({k,v})-> (v.fields.0 or {}).dataset).0
              if dataset-key => $scope.dataset.parse dataset-key, @data.bindmap(@obj.dimension)
              else @sample!
            else =>
              $scope.dataset.grid.load!
          .then (data = []) ~>
            $scope.chart.data.adopt data, !!dataset-key
            canvas.render config: plotdb.chart.config.parse(@config.value), @obj.dimension
          .catch -> console.error it
      library: do
        hash: {}
        load: (list=[]) ->
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
          ).then ~>
            ret = {}; list.map ~> ret[it] = @hash[it]
            ret

    $scope.dataset = initWrap do
      init: ->
        eventBus.listen \sheet.dataset.saved, ~> @finish \save, it
        eventBus.listen \sheet.dataset.save.failed, ~> @failed \save, it
        eventBus.listen \sheet.dataset.loaded, (payload) ~> @finish \load, payload
        eventBus.listen \sheet.dataset.parsed, (payload) ~> @finish \parse, payload
        eventBus.listen \sheet.dataset.changed, (v) -> $scope.chart.data.update v
      load: (key, bindmap, force = false) ->
        ret = @block \load
        eventBus.fire \sheet.dataset.load, key, bindmap, force
        ret
      parse: (key, bindmap, force = false) ->
        ret = @block \parse
        eventBus.fire \sheet.dataset.parse, key, bindmap, force
        ret
      bind: (dimkeys, bind) -> eventBus.fire \sheet.bind, dimkeys, bind
      save: (name) ->
        eventBus.fire \sheet.dataset.save, name
        @block \save
      grid: initWrap do
        init: ->
          eventBus.listen \sheet.grid.isClear, (v) ~> @finish \isClear, v
          eventBus.listen \sheet.grid.loaded, (data) ~> @finish \load, data
        load: ->
          ret = @block \load
          eventBus.fire \sheet.grid.load
          ret
        isClear: ->
          ret = @block \isClear
          eventBus.fire \sheet.grid.isClear.get
          ret

    $scope.download = initWrap do
      loading: false, data: null
      init: ->
        $scope.$watch 'canvas.dimension.custom', ((n,o) ~>
          if @format and JSON.stringify(n) != JSON.stringify(o) =>
            @ <<< loading: true, data: null, ready: false
            $timeout (~> @fetch @format), 1000 #quick hack for waiting canvas resized
        ), true
        $scope.$watch 'canvas.dimension.value', (n,o) ~> @customSize = (n == \Custom)
        $scope.$watch 'download.customSize', (n,o) ~>
          if n != o => canvas.dimension.set if n => \Custom else \default
        dispatcher.register \snapshot, (payload) ->
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
            filename: "#{$scope.chart.obj.name}.#{ext}"

      clear: -> @ <<< loading: false, data: null, ready: false, format: ''
      fetch: (format = \svg) ->
        @ <<< {format, loading: true, data: null, ready: false}
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
            filename: "#{$scope.chart.obj.name}.json"
        else => canvas.msg {type: \snapshot, format: format}
    
    $scope.paledit = edit: (v) -> eventBus.fire \paledit.edit, v
    $scope.coloredit = do
      idx: 0, config: (v) -> do
        class: "no-palette text-input top"
        context: "context-#{@idx++}"
        exclusive: true
        palette: [v.value]

    $scope.settingPanel = initWrap do
      tab: \publish
      init: ->
        $scope.permtype = window.[]permtype.1 or 'none'
        $scope.writable = permService.is-enough($scope.permtype, 'write')
        $scope.is-admin = permService.is-enough($scope.permtype, 'admin')
        #$scope.$watch 'chart.permission', $scope.setting-panel.permcheck, true
        #$scope.$watch 'theme.permission', $scope.setting-panel.permcheck, true
        $scope.$watch 'settingPanel.chart', ((cur, old) ~>
          if !$scope.chart.obj => return
          for k,v of cur =>
            if !v and !old[k] => continue
            $scope.chart.obj[k] = v
        ), true
        $scope.$watch 'chart.obj.inherit', (~> @chart.inherit = it), true
        $scope.$watch 'chart.obj.basetype', ~> @chart.basetype = it
        $scope.$watch 'chart.obj.visualencoding', ~> @chart.visualencoding = it
        $scope.$watch 'chart.obj.category', ~> @chart.category = it
        $scope.$watch 'chart.obj.tags', ~> @chart.tags = it
        $scope.$watch 'chart.obj.library', ~> @chart.library = it
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

    $scope.sharePanel = initWrap do
      embed: do
        width: \100%
        height: \600px
        widthRate: 4
        heightRate: 3
      init: ->
        $scope.$watch 'chart.obj.key', ~>
          if $scope.chart => @link = chartService.sharelink($scope.chart.obj or {key:''})
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


    $scope.local = do
      get: -> new Promise (res, rej) ~>
        res {}
        #@promise = {res, rej}
        #send-msg {type: \get-local}

    $scope.bind = (dimension, dataset) ->
      [v for k,v of dimension].map -> it <<< fieldName: [], fields: []
      dataset.fields.map (f) -> if f.bind => dimension[f.bind].fields.push f
      [v for k,v of dimension].map -> it.fieldName = it.fields.map -> it.name

    $scope._save = ->
      if @save.pending => return
      @save.pending = true
      chart = $scope.chart.obj
      chart.config = $scope.chart.config.value
      if !$scope.writable and chart.owner != $scope.user.data.key =>
        parent-key = chart.key or null #(if chart._type.location == \server => chart.key else null)
        # could be : <[code document stylesheet assets]>. config
        chart <<< key: null, owner: null, inherit: <[]>
        if !chart.permission => chart.permission = {switch: \publish, list: []}
        if parent-key => chart <<< {parent: parent-key}
      refresh = if !chart.key => true else false
      data = null
      $scope.local.get!
        .then (local) ~>
          chart.local = local
          data := chart.data # prevent data to be sent
          chart.data = null
          new chart-service.chart(chart).save!
        .finally ~> @save.pending = false
        .then (ret) ~>
          chart.data = data
          <~ @$apply
          plNotify.send \success, "saved"
          if refresh => window.location.href = chart-service.link {key: ret}, \v2
          else eventBus.fire \loading.dimmer.off
        .catch (err) ~> @$apply ~>
          eventBus.fire \loading.dimmer.off
          if err.2 == 402 =>
            eventBus.fire \quota.widget.on
            plNotify.send \danger, "Failed: Quota exceeded"
          else
            plNotify.aux.error.io \save, \chart, err
            console.error "[save #name]", err

    $scope.save = ->
      chart = $scope.chart.obj
      if !$scope.user.authed! =>
        $scope.auth.toggle true
        return Promise.reject!
      if @save.pending => return Promise.reject!
      promise = if chart.owner != $scope.user.data.key or !chart.name or !chart.key =>
        $scope.chartModal.name.prompt!
      else Promise.resolve!
      promise
        .then (name) ->
          if name => chart.name = name
          $scope.$apply -> eventBus.fire \loading.dimmer.on
          $scope.dataset.save chart.name
        .then (dataset) ~>
          $scope.bind chart.dimension, dataset
          canvas.msg type: \save
        .catch -> console.log it
    dispatcher.register \save, (payload) ->
      if payload.payload => $scope.chart.obj.thumbnail = payload.data
      $scope._save!


    initWrap.run!

    #####  TEMPORARY CODE #####

    $timeout (->
      if window.chart => $scope.$apply ~> $scope.chart.reset window.chart
      else plotdb.load 2251, (chart) -> $scope.$apply ~> $scope.chart.reset JSON.parse(chart._._chart)
    ), 1000

    #####  TEMPORARY CODE #####

    # v -> init             - {chart, library}
    # v <- inited           - {dimension, config}  # ack for init
    # v -> config.set       - {config, rebind}

    #   <- data.sample      - {data}
    # v -> data.update      - {data}
    # v -> data.get(sample)
    #   -> save
    #   -> snapshot         - {format}
    #   -> local.get
    #   <- local.data       - {data}
    #   <- error            - {msg, lineno}

