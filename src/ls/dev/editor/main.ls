angular.module \plotDB
  ..controller \plChartEditor,
  <[$scope $http $timeout plConfig chartService paletteService plNotify eventBus permService initWrap license]> ++ 
   ($scope,$http,$timeout,plConfig,chart-service,paletteService,plNotify,eventBus,permService,initWrap,license) ->

    # communication between renderer and editor
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

    # modals. check directive 'chartModal' for more methods
    $scope.chartModal = name: {}

    # ui controller
    $scope.panel = initWrap do
      init: -> $scope.$watch 'panel.tab', (n,o) -> 
        if n == o => return
        if n == \download => $scope.download <<< format: '', ready: false
        if o == \editor => #$scope.editor.focus!
        $scope.canvas.resize!

      tab: 'data'
      set: (v,f) -> @tab = if !f and @tab == v => '' else v


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
      size: do
        value: '' # empty or "lg"
        set: -> @value = if @value == it => '' else it
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

      # chart: base object stored in database
      load: (chart) ->
        @canvas.iframe.src = "/dev/editor/render.html"
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
              if it.getAttribute(\class).split(' ').indexOf(\lg) >= 0  => return 0
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
        $scope.$watch 'chart.config.value', ((n,o) ~> @config.parse(n,o)), true
        dispatcher.register \data.sample, ({data}) ~> @finish \sample, data
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
        update: (rebind = false) -> canvas.msg {type: \config.set, config: (@value or {}), rebind}
      data: do
        adopt: (data, bykey = true) ->
          dimension = $scope.chart.dimension
          fields = data.fields or data
          if !bykey =>
            for k,v of dimension => v <<< fields: [], fieldName: []
            fields.map ~> if it.bind and dimension[it.bind] => dimension[it.bind].fields.push it
            $scope.chart.data.set fields
          else
            for k,v of dimension =>
              v.fields = v.fields.map((f) -> fields.filter(->it.key == f.key).0).filter(->it)
          for k,v of dimension => v.fieldName = v.fields.map -> it.name
          dimkeys = [{name: k, multiple: !!v.multiple} for k,v of dimension]
          bindmap = {}
          [[k,v] for k,v of dimension].map (d) ~> d.1.fields.map ~> if it.key => bindmap[it.key] = d.0
          $scope.dataset.bind dimkeys, bindmap
          $scope.chart.data.update fields

        sample: ->
          $scope.chart.sample!then ~> @adopt it, false
        set: (data) ->
          eventBus.fire \sheet.data.set, data
        update: (data) ->
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
            cur-config = @config.value or chart.config or {}
            [[k,v] for k,v of new-config].map ~> it.1.value = cur-config[it.0].value
            @config.value = new-config
            @config.categorize!
            @dimension = JSON.parse payload.dimension
            for k,v of @obj.dimension => if @dimension[k] =>
              @dimension[k] <<< @obj.dimension[k]{fields, fieldName}
            @obj.dimension = @dimension
            dataset-key := [{k,v} for k,v of @dimension].map(({k,v})-> (v.fields.0 or {}).dataset).0
            if dataset-key => $scope.dataset.load dataset-key
            else @sample!
          .then (data = []) ~>
            canvas.render config: plotdb.chart.config.parse(@config.value)
            $scope.chart.data.adopt data, !!dataset-key


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
        eventBus.listen \sheet.dataset.saved, ~> @finish \save
        eventBus.listen \sheet.dataset.loaded, (payload) ~> @finish \load, payload
        eventBus.listen \sheet.dataset.changed, (v) -> $scope.chart.data.update v
      load: (key, force = false) -> #TODO only load if not loaded. add a force flag
        eventBus.fire \sheet.dataset.load, key, force
        @block \load
      bind: (dimkeys, bind) ->
        eventBus.fire \sheet.bind, dimkeys, bind
      save: ->
        #TODO permission check
        eventBus.fire \sheet.dataset.save
        @block \save

    $scope.download = initWrap do
      loading: false, data: null
      init: ->
        $scope.$watch 'download.customSize', (n,o) ->
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
          for k,v of cur =>
            if !v and !old[k] => continue
            $scope.chart[k] = v
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
        parent-key = (if chart._type.location == \server => chart.key else null)
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
        .finally ~>
          @save.pending = false
          eventBus.fire \loading.dimmer.off
        .then (ret) ~>
          chart.data = data
          <~ @$apply
          plNotify.send \success, "saved"
          if refresh => window.location.href = chart-service.link @chart
        .catch (err) ~> @$apply ~>
          if err.2 == 402 =>
            eventBus.fire \quota.widget.on
            plNotify.send \danger, "Failed: Quota exceeded"
          else
            plNotify.aux.error.io \save, \chart, err
            console.error "[save #name]", err

    $scope.save = ->
      chart = $scope.chart.obj
      if !$scope.user.authed! => return $scope.auth.toggle true
      if @save.pending => return
      promise = if !chart.name or !chart.key => $scope.chartModal.name.prompt! else Promise.resolve!
      promise
        .then ->
          $scope.$apply -> eventBus.fire \loading.dimmer.on
          #$scope.dataset.save!
        #.then (dataset) ->
        #  $scope.bind $scope.chart.dimension, $scope.dataset.obj
          canvas.msg type: \save
        .catch -> console.log it
    dispatcher.register \save, (payload) ->
      if payload.payload => $scope.chart.thumbnail = payload.data
      $scope._save!


    initWrap.run!

    #####  TEMPORARY CODE #####

    $timeout (->
      plotdb.load 2243, (chart) -> $scope.chart.reset JSON.parse(chart._._chart)
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

