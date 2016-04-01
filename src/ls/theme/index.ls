angular.module \plotDB
  ..service \sampleTheme, <[$rootScope]> ++ ($rootScope) ->
    plotdb.theme.sample
  ..service \themeService,
  <[$rootScope $http IOService sampleTheme baseService plUtil plNotify eventBus]> ++
  ($rootScope, $http, IOService, sampleTheme, baseService, plUtil, plNotify, eventBus) ->
    service = do
      sample: sampleTheme
      link: (theme) -> "/theme/?k=#{theme.type.location.charAt(0)}#{theme.key}"
      thumblink: (theme) -> "/theme/thumb/?k=#{theme.type.location.charAt(0)}#{theme.key}"
      #TODO better mechanism for switching domain ( dev, staging and production )
      sharelink: (theme) -> "https://plotdb.com#{@link(theme)}"
    object = (src) ->
      @ <<< do
        name: \untitled
        description: null, tags: null
        theme: null
        doc: {name: 'document', type: 'html', content: service.sample.0.{}doc.content or ""}
        style: {name: 'stylesheet', type: 'css', content: service.sample.0.{}style.content or ""}
        code: {name: 'code', type: 'javascript', content: service.sample.0.{}code.content or ""}
        config: {}
        dimension: {}
        assets: []
        #thumbnail: null
        #isType: false
        likes: 0
        parent: null
      @ <<< src
      if !Array.isArray(@assets) => @assets = []
      @

    object.prototype = do
      add-file: (name, type, content = null) ->
        file = {name, type, content}
        @assets.push file
        file
      remove-file: (file) ->
        idx = @assets.indexOf(file)
        if idx < 0 => return
        @assets.splice idx, 1

    themeService = baseService.derive \theme, service, object
    themeService
    /*
  ..controller \themeEditor,
  <[$scope $http $timeout $interval dataService chartService paletteService themeService plNotify]> ++
  ($scope, $http, $timeout, $interval, data-service, chart-service, palette-service, theme-service, plNotify) ->
    $scope <<< do # Variables
      theme: new theme-service.theme!
      chart: null
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
      canvas: do
        node: document.getElementById(\chart-renderer)
        window: document.getElementById(\chart-renderer).contentWindow
    $scope <<< do # Functions
      _save: (nothumb = false)->

        if @theme.owner != $scope.user.data.key =>
          key = (if @theme.type.location == \server => @theme.key else null)
          @theme <<< {key: null, owner: null, permission: theme-service.theme.prototype.permission}
          # clone will set parent beforehand. so we only set it if necessary.
          if key => @theme <<< {parent: key}
        refresh = if !@theme.key => true else false

        @theme.save!
          .then (ret) ~>
            <~ $scope.$apply
            if nothumb => plNotify.send \warning, "theme saved, but thumbnail failed to update"
              else plNotify.send \success, "theme saved"
            link = theme-service.link $scope.theme
            if refresh or !window.location.search => window.location.href = link
            if $scope.save.handle => $timeout.cancel $scope.save.handle
            $scope.save.handle = null
            $scope.backup.unguard 3000
          .catch (err) ~> $scope.$apply ->
            plNotify.aux.error.io \save, \theme, err
            console.error "[save theme]", err
            if $scope.save.handle => $timeout.cancel $scope.save.handle
            $scope.save.handle = null
      save: ->
        if !$scope.user.data or !$scope.user.data.key => return $scope.auth.toggle true
        if @save.handle => return
        @save.handle = $timeout (~>
          @save.handle = null
          @_save true
        ), 3000
        @canvas.window.postMessage {type: \snapshot}, @plotdomain
      clone: -> # clone forcely. same as save() when user is not the chart's owner
        @theme.name = "#{@theme.name} - Copy"
        key = (if @chart.type.location == \server => @chart.key else null)
        @theme <<< {key: null, owner: null, parent: key, permission: chartService.chart.prototype.permission}
        @save!
      load: (type, key) ->
        theme-service.load type, key
          .then (ret) ~>
            @theme = new themeService.theme(@theme <<< ret)
            @backup.check!
            $scope.backup.unguard 3000
            $scope.countline!
          .catch (ret) ~>
            console.error ret
            plNotify.send \error, "failed to load theme. please try reloading"
            window.location.href = window.location.pathname
      delete: ->
        if !@theme.key => return
        @delete.handle = true
        @theme.delete!
          .then (ret) ~>
            plNotify.send \success, "theme deleted"
            @theme = new themeService.theme!
            #TODO check future URL correctness
            setTimeout (-> window.location.href = "/theme/me.html"), 1000
            @delete.handle = false
          .catch (err) ~>
            plNotify.send \error, "failed to delete theme"
            @delete.handle = false
      reset-config: -> if @chart => for k,v of @chart.config => v.value = v.default
      migrate: ->
        if !@theme.key => return
        cloned = @theme.clone!
        cloned.type.location = (if @theme.type.location == \local => \server else \local)
        <~ cloned.save!then
        <~ @theme.delete!then
        $scope.theme = cloned
        window.location.href = theme-service.link $scope.theme
      reset: -> @render!
      render: (rebind = true) ->
        if !@chart => return
        @chart.update-data!
        for k,v of @chart => if typeof(v) != \function => @chart[k] = v
        for k,v of @theme => if typeof(v) != \function => @theme[k] = v
        payload = JSON.parse(angular.toJson({theme: @theme, chart: @chart}))
        # trigger a full reload of renderer in case any previous code ( such as timeout recursive )
        # and actually render it once loaded
        $scope.render <<< {payload, rebind}
        if !rebind => @canvas.window.postMessage {type: \render, payload, rebind}, @plotdomain
        else @canvas.window.postMessage {type: \reload}, @plotdomain
      render-async: (rebind = true)  ->
        if !@chart => return
        if @render-async.handler => $timeout.cancel @render-async.handler
        @render-async.handler = $timeout (~>
          @render-async.handler = null
          @render rebind
        ), 500
      countline: ->
        <~ <[code style doc]>.map
        @theme[it].lines = @theme[it].content.split(\\n).length
        @theme[it].size = @theme[it].content.length
      download: do
        prepare: -> <[plotdb]>.map (n) ~>
          setTimeout (~> $scope.$apply ~> [@[n].url = '', @[n]!]), 300
        plotdb: ->
          payload = angular.toJson($scope.theme)
          @plotdb.url = URL.createObjectURL new Blob [payload], {type: \application/json}
          @plotdb.size = payload.length
      colorblind: ->
        val = <[normal protanopia protanomaly deuteranopia deuteranomaly tritanopia
        tritanomaly achromatopsia achromatomaly]>
        if !(it in val) => return
        @canvas.window.postMessage {type: \colorblind-emu, payload: it}, $scope.plotdomain
      apply-theme: ->
        if @chart and @theme =>
          for k,v of @chart.config => if v._bytheme => delete @chart.config[k]
          for k,v of @chart.config =>
            if !@chart.config[k].hint => continue
            preset = @theme.typedef[@chart.config[k].type.0.name]
            if !preset => continue
            if preset[@chart.config[k].hint]? =>
              @chart.config[k].value = preset[@chart.config[k].hint]
          for k,v of @theme.config =>
            if !@chart.config[k] => @chart.config[k] = {_bytheme: true} <<< v
            else if @chart.config[k].type.0.name != v.type.0.name => continue
            else @chart.config[k].value = v.default
        if @theme => @paledit.from-theme @theme

    $scope <<< do # Behaviors
      backup: do
        enabled: false
        guard: false
        unguard: (delay) ->
          @guard = false
          $timeout ( ~>
            @guard = true
            delete $scope.unsaved
          ), delay
        init: ->
          $scope.$watch 'theme', (~>
            $scope.unsaved = true
            if !@enabled => return
            if @handle => $timeout.cancel @handle
            @handle = $timeout (~>
              @handle = null
              <~ $scope.theme.backup!then
            ), 2000 # response to final change after 2 sec.
          ), true
          # don't guard changes in 3 seconds.
          @unguard 3000
          window.onbeforeunload = ~>
            if !@guard or !$scope.unsaved => return null
            return "You have unsaved changes. Still wanna leave?"
        recover: ->
          if !@last or !@last.object => return
          $scope.theme.recover @last.object
          # disable backup until recheck to prevent backup triggered by recover.
          @enabled = false
          $scope.theme.cleanBackups!then ~> $scope.$apply ~> @check!
        check: ->
          $scope.theme.backups!
            .then (ret) ~> $scope.$apply ~>
              @ <<< {list: ret, last: ret.0}
              # disable backup for 4 sec to prevent triggered by init / recover.
              $timeout (~> @enabled = true), 4000
            .catch (err) ~> console.error 'fecth backup failed: #', err
      charts:
        list: chart-service.sample.map -> new chart-service.chart it
        set: ->
          $scope.chart = it
          if !it => return
          chart-service.load it.type, it.key
            .then (ret) ~>
              $scope.chart = new chartService.chart(ret)
              $scope.chart.theme = $scope.theme
              $scope.reset-config!
              $scope.render!
              $scope.canvas.window.postMessage {
                type: \parse-theme, payload: $scope.theme.code.content
              }, $scope.plotdomain
            .catch (ret) ~>
              console.error ret
              plNotify.send \error, "failed to load chart. please try reloading"

        init: ->
          (ret) <~ chart-service.list!then
          <~ $scope.$apply
          @list = chart-service.sample.map(-> new chart-service.chart it) ++ ret
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
          perms = $scope.theme.permission.[]value
          forkable = !!perms.filter(->it.perm == \fork and it.switch == \public).length
        init: ->
          (eventsrc) <~ <[#themeedit-sharelink #themeedit-embedcode]>.map
          clipboard = new Clipboard eventsrc
          clipboard.on \success, ->
            $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          clipboard.on \error, ->
            $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          $scope.$watch 'sharePanel.link', ~>
            @embedcode = "<iframe src=\"#it\"><iframe>"
            @thumblink = theme-service.thumblink $scope.theme
            fbobj = do
              #TODO verify
              app_id: \1546734828988373
              display: \popup
              caption: $scope.theme.name
              picture: @thumblink
              link: @link
              name: $scope.theme.name
              redirect_uri: \http://plotdb.com/
              description: $scope.theme.desc or ""
            @social.facebook = ([ "https://www.facebook.com/dialog/feed?" ] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of fbobj]
            ).join(\&)

            pinobj = do
              url: @link
              media: @thumblink
              description: $scope.theme.desc or ""
            @social.pinterest = (["https://www.pinterest.com/pin/create/button/?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of pinobj]
            ).join(\&)

            emailobj = do
              subject: "plotdb: #{$scope.theme.name}"
              body: "#{$scope.theme.desc} : #{@link}"
            @social.email = (["mailto:?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of emailobj]
            ).join(\&)

            linkedinobj = do
              mini: true
              url: @link
              title: "#{$scope.theme.name} on PlotDB"
              summary: $scope.theme.desc
              source: "plotdb.com"
            @social.linkedin = (["http://www.linkedin.com/shareArticle?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of linkedinobj]
            ).join(\&)

            twitterobj = do
              url: @link
              text: "#{$scope.theme.name} - #{$scope.theme.desc or ''}"
              hashtags: "dataviz,chart,visualization"
              via: "plotdb"
            @social.twitter = (["http://twitter.com/intent/tweet?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of twitterobj]
            ).join(\&)

          $scope.$watch 'sharePanel.forkable', ~>
            forkable = @is-forkable!
            if forkable != @forkable and @forkable? =>
              $scope.theme.permission.value = if it => [{switch: \public, perm: \fork}] else []
              @save-hint = true
          $scope.$watch 'theme.permission.value', (~>
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
        is-public: -> ("public" in $scope.theme.permission.switch)
        set-private: ->
          $scope.theme.{}permission.switch = <[private]>
          @save-hint = true
        set-public: ->
          $scope.theme.{}permission.switch = <[public]>
          @save-hint = true
      coloredit: do
        config: (v, idx) -> do
          class: "no-palette text-input"
          context: "context#idx"
          exclusive: true
          palette: [v.value]
      paledit: do #TODO should be moved to standalone controller
        convert: -> it.map(->{id: it.key or "#{Math.random!}", text: it.name, data: it.colors})
        ldcp: null, item: null
        from-theme: (theme) ->
          if !theme or !theme.config or !theme.config.palette => return @list = @list.filter -> it.text != \Theme
          themepal = @list.filter(-> it.text == \Theme).0
          if !themepal =>
            themepal = {text: 'Theme', id: '456', children: null}
            @list = [themepal] ++ @list
          themepal.children = @convert [v <<< {name:k} for k,v of theme.config.palette]
          $('#pal-select option').remove!
          $('#pal-select optgroup').remove!
          $(\#pal-select).select2 do
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

        init: ->
          @ldcp = new ldColorPicker null, {}, $('#palette-editor .editor .ldColorPicker').0
          @ldcp.on \change-palette, ~> setTimeout ( ~> $scope.$apply ~> @update! ), 0
          @list = [{ text: 'Default', id: 'default', children: @convert paletteService.sample }]
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
              $scope.$apply ~> @item.value = JSON.parse(JSON.stringify({colors: ret.data}))
              @ldcp.set-palette @item.value

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

        toggled: false
        toggle: ->
          @toggled = !!!@toggled
          if !@toggled => @update!
        edit: (item) ->
          @item = item
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
        if window.location.search == \?demo =>
          $scope.theme.doc.content = themeService.sample.1.doc.content
          $scope.theme.style.content = themeService.sample.1.style.content
          $scope.theme.code.content = themeService.sample.1.code.content
          return
        ret = /[?&]k=([sl])([^&#|?]+)/.exec(window.location.search)
        if !ret => return
        key = ret.2
        [location, key]= [(if ret.1 == \s => \server else \local), ret.2]
        $scope.load {name: \theme, location}, key
      assets: do
        measure: ->
          $scope.theme.assets.size = $scope.theme.assets.map(-> it.content.length ).reduce(((a,b)->a+b),0)
        preview: (file) ->
          @preview.toggled = true
          datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
          iframe = document.createElement("iframe")
          $('#assets-preview .iframe').0.innerHTML = "<iframe></iframe>"
          $('#assets-preview .iframe iframe').0.src = datauri
        read: (fobj) -> new Promise (res, rej) ~>
          name = if /([^/]+\.?[^/.]*)$/.exec(fobj.name) => that.1 else \unnamed
          type = \unknown
          file = $scope.theme.add-file name, type, null
          fr = new FileReader!
          fr.onload = ->
            result = fr.result
            idx = result.indexOf(\;)
            type = result.substring(5,idx)
            content = result.substring(idx + 8)
            size = $scope.theme.assets.map(->(it.content or "").length).reduce(((a,b)->a+b),0) + content.length
            if size > 3000000 => $scope.$apply ->
              plNotify.alert "Assets size limit (3MB) exceeded. won't upload."
              $scope.theme.remove-file file
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
        @$watch 'theme.assets', (~> @assets.measure!), true
        @$watch 'theme.doc.content', ~> @countline!
        @$watch 'theme.style.content', ~> @countline!
        @$watch 'theme.code.content', ~> @countline!
        @$watch 'theme.doc.content', ~> @render-async!
        @$watch 'theme.style.content', ~> @render-async!
        @$watch 'theme', (theme) ~> @render-async!
        @$watch 'chart', (chart) ~>
          @render-async!
          @theme.chart = if chart => chart.key else null
        @$watch 'theme.chart', (key) ~>
          @charts.set @charts.list.filter(-> it.key == key).0

        @$watch 'theme.code.content', (code) ~>
          if !@theme => return
          if @communicate.parse-theme-handler => $timeout.cancel @communicate.parse-theme-handler
          @communicate.parse-theme-handler = $timeout (~>
            @communicate.parse-theme-handler = null
            @canvas.window.postMessage {type: \parse-theme, payload: code}, @plotdomain
          ), 500
        @$watch 'chart.config', ((n,o={}) ~>
          ret = !!([[k,v] for k,v of n]
            .filter(([k,v]) -> !o[k] or (v.value != o[k].value))
            .map(->v.rebindOnChange)
            .filter(->it).length)
          @render-async ret
        ), true
        @$watch 'theme.key', (~> @share-panel.link = themeService.sharelink @theme)
        $scope.limitscroll $('#chart-configs').0
      communicate: -> # talk with canvas window
        ({data}) <~ window.addEventListener \message, _, false
        <~ $scope.$apply
        if !data or typeof(data) != \object => return
        if data.type == \error =>
          $('#code-editor-code .CodeMirror-code > .error').removeClass \error
          $scope.error.msg = data.{}payload.msg or ""
          $scope.error.lineno = data.{}payload.lineno or 0
          if $scope.error.lineno =>
            $("\#code-editor-code .CodeMirror-code > div:nth-of-type(#{$scope.error.lineno})").addClass \error
        else if data.type == \alt-enter => $scope.switch-panel!
        else if data.type == \snapshot =>
          #TODO need sanity check
          if data.payload => @theme.thumbnail = data.payload
          @_save!

        else if data.type == \parse =>
          {config,dimension} = JSON.parse(data.payload)
          for k,v of @chart.dimension => if dimension[k]? => dimension[k].fields = v.fields
          for k,v of @chart.config => if config[k]? => config[k].value = v.value
          for k,v of config => if !(v.value?) => v.value = v.default
          @chart <<< {config, dimension}
          $scope.render!
        else if data.type == \parse-theme =>
          {config,typedef} = JSON.parse(data.payload)
          @theme <<< {config,typedef}
          @apply-theme!
          $scope.render!
        else if data.type == \loaded =>
          if !@chart => return
          if $scope.render.payload =>
            payload = $scope.render.payload
            rebind = $scope.render.rebind
            @canvas.window.postMessage {type: \render, payload, rebind}, @plotdomain
            $scope.render.payload = null
          else
            @canvas.window.postMessage {type: \parse, payload: @chart.code.content}, @plotdomain
            @canvas.window.postMessage {type: \parse-theme, payload: @theme.code.content}, @plotdomain
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
        init: ->
          $(\#field-agent).on \mousewheel, ~> @set-position!
        data: null
        drag: do
          ging: false
          start: -> @ging = true
          end: -> @ging = false
        set-position: ->
          if !@node => return
          box = @node.getBoundingClientRect!
          box2 = @node.parentNode.parentNode.getBoundingClientRect!
          scroll = left: $(\#data-fields).scrollLeft(), top: $(\#data-fields).scrollTop()
          $(\#field-agent).css do
            top: "#{box.top - box2.top + 55 - scroll.top}px"
            left: "#{box.left - box2.left - scroll.left}px"
            width: "#{box.width}px"
            height: "#{box.height}px"
        set-proxy: (e,data) ->
          if @drag.ging => return
          [@data,node] = [data,e.target]
          while true
            if node.getAttribute("class").indexOf('data-field') >=0 => break
            node = node.parentNode
            if node.nodeName.toLowerCase! == \body => return
          <~ setTimeout _, 0
          @node = node
          @set-position!

      init: ->
        @communicate!
        @hid-handler!
        @monitor!
        @check-param!
        @paledit.init!
        @backup.init!
        @field-agent.init!
        @charts.init!

    $scope.init!
*/
  ..controller \themeList,
  <[$scope $http IOService dataService themeService]> ++
  ($scope, $http, IO-service, data-service, theme-service) ->
    $scope.themes = []
    (ret) <- Promise.all [
      new Promise (res, rej) -> IO-service.aux.list-locally {name: \theme}, res, rej
      new Promise (res, rej) -> IO-service.aux.list-remotely {name: \theme}, res, rej, "q=all"
    ] .then
    <~ $scope.$apply
    $scope.themes = ( ret.0 ++ ret.1 )
    $scope.themes.forEach (it) ->
      it.width = if Math.random() > 0.8 => 640 else 320
    $scope.load = (theme) -> window.location.href = theme-service.link theme

