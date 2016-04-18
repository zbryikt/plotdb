angular.module \plotDB
  ..controller \plEditor,
  <[$scope $http $timeout $interval $sce plConfig IOService dataService chartService paletteService themeService plNotify]> ++ ($scope,$http,$timeout,$interval,$sce,plConfig,IOService,data-service,chart-service,paletteService,themeService,plNotify) ->
    #########  Variables  ################################################################
    $scope <<< do
      plConfig: plConfig
      theme: new theme-service.theme! #TODO defer create. consider theme and chart
      chart: new chart-service.chart!
      showsrc: true
      vis: \preview
      lastvis: null
      plotdb-domain: "#{plConfig.urlschema}#{plConfig.domain}" #"#{plConfig.urlschema}#{plConfig.domainIO}"
      #plotdb-renderer: $sce.trustAsResourceUrl("#{plConfig.urlschema}#{plConfig.domainIO}/render.html")
      plotdb-renderer: "#{plConfig.urlschema}#{plConfig.domain}/render.html"
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
      type: null     # chart or theme
      service: null  # chart-service or theme-service

    $http url: $scope.plotdb-renderer, method: \GET
      .success (html) ->
        ret = /<meta name="script" content="([^"]+)">/.exec html
        if ret =>
          $http url: ret.1, method: \GET
            .success (js) ->
              urljs = URL.createObjectURL new Blob [js], {type: \text/javascript}
              html := html.replace(
                /<meta name="script" content="([^"]+)">/
                "<script type='text/javascript' src='#urljs'></script>"
              )
              urlhtml = URL.createObjectURL new Blob [html], {type: \text/html}
              $scope.plotdb-domain = urlhtml
              #TODO: directly regen iframe so we don't have to consider timing issue
              $timeout (->
                $scope.plotdb-renderer = $sce.trustAsResourceUrl(urlhtml)
              ), 1000

    #########  Functions  ################################################################
    $scope <<< do
      target: -> @[@type]
      mode: set: (value) ->
        $scope <<< switch value
        | \chart => {value, type: \chart, service: chart-service}
        | \theme => {value, type: \theme, service: theme-service}
      _save: (nothumb = false)->
        if @target!.owner != @user.data.key =>
          key = (if @target!._type.location == \server => @target!.key else null)
          @target! <<< {key: null, owner: null, permission: {switch: [], value: []}}
          # clone will set parent beforehand. so we only set it if necessary.
          if key => @target! <<< {parent: key}
        refresh = if !@target!.key => true else false
        if @target!.dimension => @target!.dimlen = [k for k of @target!.dimension or {}].length
        @target!.save!
          .then (ret) ~>
            <~ @$apply
            if nothumb => plNotify.send \warning, "#{@type} saved, but thumbnail failed to update"
              else plNotify.send \success, "#{@type} saved"
            link = @service.link @target!
            if refresh or !window.location.search => window.location.href = link
            if @save.handle => $timeout.cancel @save.handle
            @save.handle = null
            @backup.unguard 3000
          .catch (err) ~> @$apply ~>
            plNotify.aux.error.io \save, @type, err
            console.error "[save #name]", err
            if @save.handle => $timeout.cancel @save.handle
            @save.handle = null
      save: ->
        if !$scope.user.authed! => return $scope.auth.toggle true
        if @save.handle => return
        @save.handle = $timeout (~>
          @save.handle = null
          @_save true
        ), 3000
        @canvas.window.postMessage {type: \snapshot}, @plotdb-domain
      clone: -> # clone forcely. same as save() when user is not the chart's owner
        @target!.name = "#{@target!.name} - Copy"
        key = (if @target!._type.location == \server => @target!.key else null)
        @target! <<< {key: null, owner: null, parent: key, permission: {switch: [], value: []}}
        @save!
      load: (type, key) ->
        @service.load type, key
          .then (ret) ~>
            @[@type] = new @service[@type](@[@type] <<< ret)
            @backup.check!
            $scope.backup.unguard 3000
            $scope.countline!
          .catch (ret) ~>
            console.error ret
            plNotify.send \error, "failed to load chart. please try reloading"
            #TODO check at server time?
            if ret.1 == \forbidden => window.location.href = \/403.html #window.location.pathname
      delete: ->
        if !@target!.key => return
        @delete.handle = true
        @target!.delete!
          .then (ret) ~>
            plNotify.send \success, "#{@type} deleted"
            @[@type] = new @service[@type]!
            #TODO check future URL correctness
            $scope.backup.unguard 10000
            setTimeout (~> window.location.href = "/#{@type}/me/"), 1000
            @delete.handle = false
          .catch (err) ~>
            plNotify.send \error, "failed to delete #{@type}"
            @delete.handle = false
      reset-config: -> if @chart => for k,v of @chart.config => v.value = v.default
      #TODO review binding process
      dimension: do
        bind: (event, dimension, field = {}) ->
          field.update!
            .then ~>
              if dimension.multiple => dimension.[]fields.push field
              else dimension.fields = [field]
              $scope.render!
            .catch (err) ~>
              plNotify.send \error, "failed to bind field. try again later."
              console.error "chart.ls / dimension field binding failed due to : ", err
        unbind: (event, dimension, field = {}) ->
          idx = dimension.fields.index-of(field)
          if idx < 0 => return
          dimension.fields.splice idx, 1
          $scope.render!
      reset: -> @render!
      render: (rebind = true) ->
        if !@chart => return
        @chart.update-data!
        payload = JSON.parse(angular.toJson({theme: @theme, chart: @chart}))
        # trigger a full reload of renderer in case any previous code ( such as timeout recursive )
        # and actually render it once loaded
        $scope.render <<< {payload, rebind}
        if !rebind => @canvas.window.postMessage {type: \render, payload, rebind}, @plotdb-domain
        else @canvas.window.postMessage {type: \reload}, @plotdb-domain
      render-async: (rebind = true)  ->
        if !@chart => return
        if @render-async.handler => $timeout.cancel @render-async.handler
        @render-async.handler = $timeout (~>
          @render-async.handler = null
          @render rebind
        ), 500
      parse: do
        send: (name) -> 
          if !$scope[name] => return
          @[name]pending = true
          $scope.canvas.window.postMessage(
            { type: "parse-#name", payload: $scope[name].code.content }
            $scope.plotdb-domain
          )
        chart: -> @send \chart
        theme: -> @send \theme

      countline: ->
        <~ <[code style doc]>.map
        @target![it].lines = @target![it].content.split(\\n).length
        @target![it].size = @target![it].content.length
      download: do
        prepare: -> <[svg png plotdb]>.map (n) ~>
          setTimeout (~> $scope.$apply ~> [@[n].url = '', @[n]!]), 300
        svg: -> $scope.canvas.window.postMessage {type: \getsvg}, $scope.plotdb-domain
        png: -> $scope.canvas.window.postMessage {type: \getpng}, $scope.plotdb-domain
        plotdb: ->
          payload = angular.toJson($scope.target!)
          @plotdb.url = URL.createObjectURL new Blob [payload], {type: \application/json}
          @plotdb.size = payload.length
      colorblind: do
        val: \normal
        vals: <[
          normal protanopia protanomaly deuteranopia deuteranomaly tritanopia
          tritanomaly achromatopsia achromatomaly
        ]>
        set: ->
          if !(it in @vals) => return
          @val = it
          $scope.canvas.window.postMessage {type: \colorblind-emu, payload: it}, $scope.plotdb-domain
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

    #########  Behaviors  ################################################################
    $scope <<< do
      backup: do
        enabled: false
        guard: false
        unguard: (delay = 1000) ->
          @guard = false
          $timeout ( ~>
            @guard = true
            delete $scope.unsaved
          ), delay
        init: ->
          $scope.$watch $scope.type, (~>
            $scope.unsaved = true
            if !@enabled => return
            if @handle => $timeout.cancel @handle
            @handle = $timeout (~>
              @handle = null
              <~ $scope.target!.backup!then
            ), 2000 # response to final change after 2 sec.
          ), true
          # don't guard changes in 3 seconds.
          @unguard 3000
          window.onbeforeunload = ~>
            if !@guard or !$scope.unsaved => return null
            return "You have unsaved changes. Still wanna leave?"
        recover: ->
          if !@last or !@last.object => return
          $scope.target!.recover @last.object
          # disable backup until recheck to prevent backup triggered by recover.
          @enabled = false
          $scope.target!.cleanBackups!then ~> $scope.$apply ~> @check!
        check: ->
          $scope.target!.backups!
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
          if it._type.location == \sample => #Better way ? integrate with chart-service.load?
            $scope.chart = new chart-service.chart(it)
            $scope.chart.theme = $scope.theme
            $scope.reset-config!
            $scope.render!
            $scope.parse.theme!
            return
          chart-service.load it._type, it.key
            .then (ret) ~>
              $scope.chart = new chart-service.chart(ret)
              $scope.chart.theme = $scope.theme
              $scope.reset-config!
              $scope.render!
              $scope.parse.theme!
              #TBR $scope.canvas.window.postMessage {
              #  type: \parse-theme, payload: $scope.theme.code.content
              #}, $scope.plotdb-domain
            .catch (ret) ~>
              console.error ret
              plNotify.send \error, "failed to load chart. please try reloading"
        init: ->
          IO-service.list-remotely(
            {name: \chart}
            {owner: (if $scope.user.data => $scope.user.data.key else -1)}
          )
            .then (ret) ~>
              <~ $scope.$apply
              @list = (chart-service.sample ++ ret).map -> new chartService.chart(it)
            .catch ->
              console.error e
              plNotify.send \error, "failed to load chart list. use sample chart instead"
      themes:
        list: theme-service.sample
        set: -> $scope.theme = it
        init: ->
          (ret) <~ theme-service.list!then
          <~ $scope.$apply
          @list = ret
      editor: do
        class: ""
        focus: ->
          # codemirror won't update if it's not visible. so wait a little
          # refresh will reset cursor which scroll to the top.
          # so we only want to refresh once.
          # EDIT: looks like some other changes made this statement not applicable.
          # maybe remove it later. TODO
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
          perms = $scope.target!.permission.[]value
          forkable = !!perms.filter(->it.perm == \fork and it.switch == \public).length
        init: ->
          #TODO must also update jade file ( chartedit -> edit )
          (eventsrc) <~ <[#edit-sharelink #edit-embedcode]>.map
          clipboard = new Clipboard eventsrc
          clipboard.on \success, ->
            $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          clipboard.on \error, ->
            $(eventsrc).tooltip({title: 'Press Ctrl+C to Copy', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 1000)
          $scope.$watch 'sharePanel.link', ~>
            @embedcode = "<iframe src=\"#it\"><iframe>"
            @thumblink = $scope.service.thumblink $scope.chart
            fbobj = do
              #TODO verify
              app_id: \1546734828988373
              display: \popup
              caption: $scope.target!.name
              picture: @thumblink
              link: @link
              name: $scope.target!.name
              redirect_uri: \http://plotdb.com/
              description: $scope.target!.description or ""
            @social.facebook = ([ "https://www.facebook.com/dialog/feed?" ] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of fbobj]
            ).join(\&)

            pinobj = do
              url: @link
              media: @thumblink
              description: $scope.target!.description or ""
            @social.pinterest = (["https://www.pinterest.com/pin/create/button/?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of pinobj]
            ).join(\&)

            emailobj = do
              subject: "plotdb: #{$scope.target!.name}"
              body: "#{$scope.target!.description} : #{@link}"
            @social.email = (["mailto:?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of emailobj]
            ).join(\&)

            linkedinobj = do
              mini: true
              url: @link
              title: "#{$scope.target!.name} on PlotDB"
              summary: $scope.target!.description
              source: "plotdb.com"
            @social.linkedin = (["http://www.linkedin.com/shareArticle?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of linkedinobj]
            ).join(\&)

            twitterobj = do
              url: @link
              text: "#{$scope.target!.name} - #{$scope.target!.description or ''}"
              hashtags: "dataviz,chart,visualization"
              via: "plotdb"
            @social.twitter = (["http://twitter.com/intent/tweet?"] ++
              ["#k=#{encodeURIComponent(v)}" for k,v of twitterobj]
            ).join(\&)

          $scope.$watch 'sharePanel.forkable', ~>
            forkable = @is-forkable!
            if forkable != @forkable and @forkable? =>
              $scope.target!.permission.value = if it => [{switch: \public, perm: \fork}] else []
              $scope.target!.searchable = it
              @save-hint = true
          $scope.$watch "#{$scope.type}.permission.value", (~>
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
        is-public: -> ("public" in $scope.target!.permission.switch)
        set-private: ->
          $scope.target!.{}permission.switch = <[private]>
          @save-hint = true
        set-public: ->
          $scope.target!.{}permission.switch = <[public]>
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
        if @vis == \preview => $scope.codemirror.objs.forEach -> it.getInputField!.blur!
        else $scope.codemirror.objs.forEach -> it.refresh!

      hid-handler: ->
        # Switch Panel by alt-enter
        $scope.codemirrored = (editor) -> $scope.codemirror.objs.push editor
        document.body.addEventListener \keydown, (e) ~>
          if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
            $scope.$apply ~> @switch-panel!

      check-param: ->
        if !window.location.search => return
        if window.location.search == \?demo =>
          $scope.target!.doc.content = $scope.service.sample.1.doc.content
          $scope.target!.style.content = $scope.service.sample.1.style.content
          $scope.target!.code.content = $scope.service.sample.1.code.content
          return
        ret = /[?&]k=([sl])([^&#|?]+)/.exec(window.location.search)
        if !ret => return
        key = ret.2
        [location, key]= [(if ret.1 == \s => \server else \local), ret.2]
        $scope.load {name: $scope.type, location}, key
      assets: do
        measure: ->
          $scope.target!.[]assets.size = $scope.target!.assets.map(-> it.content.length ).reduce(((a,b)->a+b),0)
        preview: (file) ->
          @preview.toggled = true
          datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
          iframe = document.createElement("iframe")
          $('#assets-preview .iframe').0.innerHTML = "<iframe></iframe>"
          $('#assets-preview .iframe iframe').0.src = datauri
        read: (fobj) -> new Promise (res, rej) ~>
          name = if /([^/]+\.?[^/.]*)$/.exec(fobj.name) => that.1 else \unnamed
          type = \unknown
          file = $scope.target!.add-file name, type, null
          fr = new FileReader!
          fr.onload = ->
            result = fr.result
            idx = result.indexOf(\;)
            type = result.substring(5,idx)
            content = result.substring(idx + 8)
            size = $scope.target!.[]assets.map(->(it.content or "").length).reduce(((a,b)->a+b),0) + content.length
            if size > 3000000 => $scope.$apply ->
              plNotify.alert "Assets size limit (3MB) exceeded. won't upload."
              $scope.target!.remove-file file
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
        @$watch "#{$scope.type}.assets", (~> @assets.measure!), true
        @$watch "#{$scope.type}.doc.content", ~> @countline!
        @$watch "#{$scope.type}.style.content", ~> @countline!
        @$watch "#{$scope.type}.code.content", ~> @countline!
        @$watch "#{$scope.type}.doc.content", ~> @render-async!
        @$watch "#{$scope.type}.style.content", ~> @render-async!
        @$watch 'theme', (theme) ~>
          @render-async!
          if @chart => @chart.theme = if theme => theme.key else null
        @$watch 'chart', (chart) ~>
          @render-async!
          if @theme => @theme.chart = if chart => chart.key else null

        @$watch 'chart.theme', (key) ~>
          if @type == \chart => @theme = @themes.list.filter(-> it.key == key).0
        @$watch 'theme.chart', (key) ~>
          if @type == \theme => @charts.set @charts.list.filter(-> it.key == key).0
        @$watch "chart.code.content", (code) ~>
          if @communicate.parse-handler => $timeout.cancel @communicate.parse-handler
          @communicate.parse-handler = $timeout (~>
            @communicate.parse-handler = null
            $scope.parse.chart!
            #TBR @canvas.window.postMessage {type: \parse, payload: code}, @plotdb-domain
          ), 500
        @$watch 'theme.code.content', (code) ~>
          if !@theme => return
          if @communicate.parse-theme-handler => $timeout.cancel @communicate.parse-theme-handler
          @communicate.parse-theme-handler = $timeout (~>
            @communicate.parse-theme-handler = null
            $scope.parse.theme!
            #TBR @canvas.window.postMessage {type: \parse-theme, payload: code}, @plotdb-domain
          ), 500
        @$watch 'chart.config', ((n,o={}) ~>
          ret = !!([[k,v] for k,v of n]
            .filter(([k,v]) -> !o[k] or (v.value != o[k].value))
            .map(->(it.1 or {}).rebindOnChange)
            .filter(->it).length)
          @render-async ret
        ), true
        @$watch "#{@type}.key", (~> @share-panel.link = chartService.sharelink @target!)
        if $('#data-fields').0 => $scope.limitscroll
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
          if data.payload => @target!.thumbnail = data.payload
          @_save!

        else if data.type == \parse-chart =>
          $scope.parse.chart.pending = false
          {config,dimension} = JSON.parse(data.payload)
          for k,v of @chart.dimension => if dimension[k]? => dimension[k].fields = v.fields
          for k,v of @chart.config => if config[k]? => config[k].value = v.value
          for k,v of config => if !(v.value?) => v.value = v.default
          @chart <<< {config, dimension}
          $scope.render!
        else if data.type == \parse-theme =>
          $scope.parse.theme.pending = false
          {config,typedef} = JSON.parse(data.payload)
          @theme <<< {config,typedef}
          @apply-theme!
          $scope.render!
        else if data.type == \loaded =>
          if !@chart => return
          if $scope.render.payload =>
            @canvas.window.postMessage {type: \render} <<< $scope.render{payload,rebind}, @plotdb-domain
            $scope.render.payload = null
          if $scope.parse.chart.pending =>
            if @chart => @canvas.window.postMessage {type: \parse-chart, payload: @chart.code.content}, @plotdb-domain
            $scope.parse.chart.pending = null
          if $scope.parse.theme.pending =>
            if @theme => @canvas.window.postMessage {type: \parse-theme, payload: @theme.code.content}, @plotdb-domain
            $scope.parse.theme.pending = null
          #@canvas.window.postMessage {type: \parse, payload: @chart.code.content}, @plotdb-domain
          #if @theme => @canvas.window.postMessage {type: \parse-theme, payload: @theme.code.content}, @plotdb-domain
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
        if @type == \theme => @charts.init!
        if @type == \chart => @themes.init!

    $scope.mode.set (if /^\/chart\//.exec(window.location.pathname) => \chart else  \theme)
    $scope.init!
