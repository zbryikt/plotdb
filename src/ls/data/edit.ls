angular.module \plotDB
  ..controller \dataEditCtrl,
  <[$scope $interval $timeout $http permService dataService eventBus plNotify Paging]> ++
  ($scope, $interval, $timeout, $http, permService, data-service, eventBus, plNotify, Paging) ->
    eventBus.fire \loading.dimmer.on
    $scope.permtype = window.[]permtype.1 or 'none'
    $scope.is-admin = permService.is-enough($scope.permtype, 'admin')
    $scope <<< do
      rawdata: ""
      dataset: null
      worker: new Worker("/js/data/worker.js")
      loading: false
      inited: false
      show-grid: true
    $scope.$watch 'inited', ->
      eventBus.fire "loading.dimmer.#{if it => \off else \on}"
    $scope.name = null
    $scope.clone = ->
      if !$scope.dataset or !$scope.dataset.key => return
      $scope.dataset.key = null
      $scope.dataset.name = $scope.dataset.name + " - Copy"
      $scope.save!
    $scope.save = (locally = false) ->
      if !$scope.dataset => return
      if !$scope.user.authed! => return $scope.auth.toggle true
      promise = if !$scope.dataset.name =>
        $scope.panel.name.prompt!
      else Promise.resolve!
      <- promise.then _
      $scope.$apply -> eventBus.fire \loading.dimmer.on
      promise = null
      if $scope.grid.toggled => promise = Promise.resolve!
      else $scope.$apply -> promise := $scope.parser.csv.read($scope.rawdata, false)
      <- promise.then _
      data = $scope.grid.data
      if data.headers.length >= 40 => return $scope.$apply ->
        eventBus.fire \loading.dimmer.off
        return plNotify.send \danger, "maximal 40 columns is allowed. you have #{data.headers.length}"
      if data.headers.length == 0 => return $scope.$apply ->
        eventBus.fire \loading.dimmer.off
        plNotify.send \danger, "no data to save. add some?"

      #$scope.dataset._type.location = (if locally => \local else \server) # future feature
      #$scope.dataset.permission = {"list": [], "switch": "publish"}
      payload = $scope.grid.data.fieldize!
      $scope.dataset.set-fields payload #$scope.parse.result
      is-create = if !$scope.dataset.key => true else false
      $scope.dataset.save!
        .then (r) ->
          $scope.$apply -> plNotify.send \success, "dataset saved"
          if is-create =>
            if $scope.$parent and $scope.$parent.inline-create =>
              $scope.$parent.inline-create $scope.dataset
              $scope.$apply -> eventBus.fire \loading.dimmer.off
            else
              setTimeout (->
                window.location.href = data-service.link $scope.dataset
              ), 1000
          else
            $scope.$apply -> eventBus.fire 'loading.dimmer.off'
          eventBus.fire \dataset.saved, $scope.dataset
        .catch (e) -> $scope.$apply ->
          eventBus.fire 'loading.dimmer.off'
          if e.2 == 402 =>
            eventBus.fire \quota.widget.on
            plNotify.send \danger, "Failed: Quota exceeded"
          else
            console.log e.stack
            plNotify.aux.error.io \save, \data, e
    $scope.load = (_type, key) ->
      eventBus.fire \loading.dimmer.on
      $scope.rawdata = ""
      worker = new Worker \/js/data/worker/parse-dataset.js
      worker.onmessage = (e) ->
        data = e.data
        $scope.$apply ->
          $scope.grid.data.headers = data.data.headers
          $scope.grid.data.rows = data.data.rows
          $scope.grid.data.types = data.data.types
        $scope.grid.render!then -> $scope.$apply ->
          $scope.inited = true
          $scope.loading = false
          eventBus.fire \loading.dimmer.off
      data-service.load _type, key
        .then (ret) ~>
          <- $scope.$apply
          $scope.dataset = dataset = new data-service.dataset ret
          $scope.grid.data.size = JSON.stringify(dataset).length
          worker.postMessage {dataset}
        .catch (ret) ~>
          <- $scope.$apply
          console.error ret
          plNotify.send \error, "failed to load dataset. please try reloading"
          #TODO check at server time?
          if ret.1 == \forbidden => window.location.href = \/403.html #window.location.pathname
          $scope.inited = true
          $scope.loading = false
          eventBus.fire 'loading.dimmer.off'
    $scope.delete = (dataset) ->
      if !dataset or !dataset.key => return
      eventBus.fire \confirmbox.on, do
        title: 'Delete'
        message: 'Are you sure to delete this dataset?'
        options: ['Yes', 'Cancel']
        callback: ->
          if it == 1 => return
          eventBus.fire \loading.dimmer.on
          dataset.delete!
            .then ->
              plNotify.send \success, "dataset deleted"
              $timeout (-> window.location.href = "/dataset/" ), 1300
            .catch (ret) ->
              console.error ret
              plNotify.send \error, "failed to delete dataset. please try later."

    $scope.load-dataset = (dataset) ->
      $scope.dataset = dataset
      $scope.name = dataset.name
      fields = dataset.fields.map -> it.name
      $scope.rawdata = ([fields.join(",")] ++ dataset.data.map((obj)->fields.map(->obj[it]).join(\,))).join(\\n)

    # =============== Functions  ================
    $scope <<< do
      communicate: ->
        $scope.worker.onmessage = ({data: payload}) -> $scope.$apply ->
          if typeof(payload) != \object => return
          switch payload.type
          | "parse.revert" =>
            $scope.rawdata = payload.data
            $scope.loading = false
            eventBus.fire 'loading.dimmer.off'
      reset: (rawdata = "",force=false) ->
        if force =>
          if $scope.$parent and $scope.$parent.inline-create =>
            $scope.dataset = new dataService.dataset!
            $scope.rawdata = rawdata or ""
            $scope.grid.data <<< {rows: [], headers: [], types: []}
            $scope.grid.render!
          else window.location.href = "/dataset/"
        else =>
          dataset = new dataService.dataset(window.dataset or {})
          dataset.name = ""
          if $scope.dataset and $scope.dataset.name => dataset.name = $scope.dataset.name
          $scope <<< {dataset, rawdata}
      init: ->
        @reset ""
        # e.g.: /dataset/?k=s123 )
        ret1 = (
          if /\/dataset\//.exec(window.location.pathname) =>
            /[?&]k=([sc])([^&?#]+)/.exec(window.location.search or "")
          else => null
        )
        # e.g.: /dataset/123/
        ret2 = /^\/data(s)et\/([0-9]+)\/?/.exec(window.location.pathname or "")
        if ret1 or ret2 =>
          ret = that
          $scope.dataset.key = ret.2
          $scope.load {location: (if ret.1 == \s => \server else \local), name: \dataset}, ret.2
        else
          eventBus.fire \loading.dimmer.off
          $scope.inited = true
        $(\#dataset-edit-text).on \keydown, -> $scope.$apply -> $scope.parse.run!catch ->
        $('[data-toggle="tooltip"]').tooltip!
        @communicate!

    $scope.parse = do
      rows: 0, fields: 0, size: 0
      result: null
      loading: false
      handle: null
      revert: (dataset) ->
        $scope.loading = true
        $scope.worker.postMessage {type: "parse.revert", data: dataset}
      promise: null
      run: (force = false) -> new Promise (res, rej) ~>
        $scope.loading = true
        _ = ~>
          $scope.parser.csv.read $scope.rawdata, false
          res!
        if @handle =>
          $timeout.cancel @handle
          if @promise => @promise.rej \cancelled
        @promise = {res, rej}
        if force => return _!
        else @handle = $timeout (~> _! ), (if force => 0 else 1000)

    $scope.parser = do
      progress: (sec = 2000)->
        progress = 0
        if @progress-handler => $interval.cancel @progress-handler
        @progress-handler = $interval (~>
          progress := progress + (100 - progress) / (if progress < 80 => 4 else 8)
          if progress > 97 =>
            $interval.cancel @progress-handler
            @progres-handler = 0
          eventBus.fire \loading.dimmer.progress, progress
        ), sec / 6

    $scope.parser.csv = do
      encodings: <[UTF-8 BIG5 GB2312 ISO-8859-1]>
      encoding: \UTF-8
      worker: null
      toggle: (v) -> @toggled = (if v? => v else !!!@toggled)
      toggled: false
      import: (buf) ->
        node = document.getElementById(\dataset-import-dropdown)
        node.className = node.className.replace /open/, ''
        $scope.parser.csv.buf = buf
        $scope.parser.csv.toggle true
      read: (_buf,verbose = true) -> new Promise (res, rej) ~>
        buf = _buf
        if !(buf?) => buf = @buf
        if !buf => buf = ""
        if verbose => eventBus.fire \loading.dimmer.on, 1
        sec = buf.length * 1.3 / 1000
        $scope.parser.progress sec
        if !@worker => @worker = new Worker \/js/data/worker/csv.js
        @worker.onmessage = (e) ~>
          data = e.data.data
          $scope.$apply ~>
            $scope.grid.data.rows = data.rows
            $scope.grid.data.headers = data.headers
            $scope.grid.data.types = data.types
            $scope.grid.data.size = buf.length
          $scope.grid.render data{trs, ths} .then ~> $scope.$apply ~>
            @toggle false
            @buf = null
            if verbose => eventBus.fire \loading.dimmer.off
            $scope.loading = false
            res!
        @worker.postMessage {buf}
        #$scope.reset buf.trim! #utf8.decode(buf).trim!

    $scope.parser.xls = do
      worker: null
      read: (buf) ->
        eventBus.fire \loading.dimmer.on, 1
        sec = buf.length * 2.5 / 1000
        $scope.parser.progress sec
        if !@worker =>
          @worker = new Worker \/js/data/worker/excel.js
          @worker.onmessage = (e) -> $scope.$apply ->
            data = e.data.data
            $scope.grid.data.headers = data.headers
            $scope.grid.data.rows = data.rows
            $scope.grid.data.types = data.types
            $scope.grid.data.size = buf.length
            $scope.grid.render data{trs, ths} .then -> # 1.3
              $scope.$apply -> eventBus.fire \loading.dimmer.off
        node = document.getElementById(\dataset-import-dropdown)
        node.className = node.className.replace /open/, ''
        $timeout (~> @worker.postMessage {buf}), 100

    $scope.parser.gsheet = do
      url: null
      api-key: \AIzaSyD3emlU63t6e_0n9Zj9lFCl-Rwod0OMTqY
      client-id: \1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com
      scopes: <[
        profile
        https://www.googleapis.com/auth/drive.metadata.readonly
        https://www.googleapis.com/auth/spreadsheets.readonly
      ]>.join(' ')
      init: ->
        gapi.load 'client:auth2', ~>
          gapi.client.load 'drive', 'v3'
          gapi.client.set-api-key @api-key
          gapi.auth2.init do
            client_id: @client-id
            scope: @scopes
          if $(\#gsheet-list-end) =>
            Paging.load-on-scroll (-> $scope.parser.gsheet.list!), $(\#gsheet-list-end), $(\#gsheet-files)
      files: []
      auth: ->
        auth = gapi.auth2.get-auth-instance!
        if auth.is-signed-in.get! => return auth
        else
          eventBus.fire \loading.dimmer.on
          return auth.sign-in!
      list: ->
        if @loading => return
        @loading = true
        <~ @auth!then
        eventBus.fire \loading.dimmer.off
        config = do
          pageSize: 40,
          fields: "nextPageToken, files(id, name)"
          q: "mimeType='application/vnd.google-apps.spreadsheet'"
        if @pageToken => config.pageToken = @pageToken
        request = gapi.client.drive.files.list config
        request.execute (ret) ~>
          @pageToken = ret.nextPageToken
          $scope.$apply ~>
            @files ++= ret.files
            @loading = false
      toggle: ->
        @toggled = !!!@toggled
        if @toggled and !@files.length => @list!
      load: (file) ->
        eventBus.fire \loading.dimmer.on, 1
        $scope.parser.progress 3000
        gapi.client.load 'https://sheets.googleapis.com/$discovery/rest?version=v4'
          .then ->
            gapi.client.sheets.spreadsheets.values.get do
              spreadsheetId: file.id
              range: 'A:ZZ'
          .then(
            ((ret) ~>
              list = ret.result.values
              data = $scope.grid.data
              $scope.$apply ~>
                data.headers = h = list.0
                list.splice 0,1
                data.rows = list
                #TODO move to worker
                data.types = plotdb.Types.resolve data
                data.size = (ret.body or "").length
              $scope.grid.render!then ~>
                $scope.$apply ~>
                  @toggled = false
                  eventBus.fire \loading.dimmer.off
            ),
            (-> $scope.$apply ~>
              plNotify.send \danger, "can't load sheet, try again later?"
              eventBus.fire \loading.dimmer.off
            )
          )

    $scope.panel = do
      name: do
        promise: null
        focus: -> if @toggled => document.getElementById(\dataset-name-input).focus!
        keyhandler: (e) ->
          key = e.keyCode or e.which
          if key == 13 => @action 0
        toggle: (name) ->
          @ <<< {value: name, toggled: true}
          @focus!
        prompt: -> new Promise (res, rej) ~>
          @ <<< {promise: {res, rej}, toggled: true}
          @focus!
        value: ""
        action: (idx) ->
          if idx == 0 =>
            if !@value => return
            $scope.{}dataset.name = @value
            $(\#dataset-name).text @value
          @toggled = false
          if @promise =>
            if idx => @promise.rej!
            else if !idx => @promise.res @value

      toggle: (name) ->
        if !$scope.{}dataset.key =>
          if !name => return
        if name =>
          @{}[name]toggled = !!!@{}[name]toggled
        else @toggled = !!! @toggled
    eventBus.listen \dataset.delete, (key) -> if $scope.dataset.key == key => $scope.dataset = null
    eventBus.listen \dataset.sample, (data) ->
      $scope.grid.data.headers = h = [k for k,v of data.0]
      $scope.grid.data.rows = data.map((d)-> h.map(->d[it]))
      $scope.grid.render!
    eventBus.listen \dataset.edit, (dataset, load = true) ->
      $scope.inited = false
      if load and dataset._type.location == \server =>
        $scope.load dataset._type, dataset.key
      else
        $scope.dataset = new data-service.dataset dataset
        $scope.parse.revert $scope.dataset
        $scope.inited = true

    $scope.grid = do
      toggled: true
      _toggle: (v) ->
        @toggled = v
        if !@toggled => @convert!
      toggle: (v) ->
        ret = if v => v else !!!@toggled
        if !ret and @data.rows.length > 1000 =>
          eventBus.fire 'confirmbox.on', do
            title: "Wait!"
            message: "Raw editing in a large dataset will be very slow. Are you sure?"
            options: <[Yes Cancel]>
            callback: ~> if it == 0 => @_toggle ret
        else @_toggle ret
      convert: ->
        eventBus.fire \loading.dimmer.on
        if !@convert-worker => @convert-worker = new Worker \/js/data/worker/data-to-raw-wrap.js
        @convert-worker.onmessage = (e) ->
          <- $scope.$apply
          $scope.rawdata = e.data.raw.trim!
          eventBus.fire \loading.dimmer.off
        @convert-worker.postMessage @data{headers, rows, types}

      worker: null
      data: do
        rows: []
        headers: []
        trs: []
        clusterizer: null
        fieldize: ->
          ret = @headers.map (d,i) ~> { data: [], datatype: @types[i], name: d }
          for i from 0 til @rows.length =>
            for j from 0 til @headers.length => ret[j].data.push @rows[][i][j]
          return ret

      render: (obj = {}) ->
        {head-only,ths,trs} = obj
        return new Promise (res, rej) ~>
          head = document.querySelector '#dataset-editbox .sheet .sheet-head'
          scroll = document.querySelector '#dataset-editbox .sheet .clusterize-scroll'
          content = document.querySelector '#dataset-editbox .sheet .clusterize-content'
          if !@worker => @worker = new Worker \/js/data/worker/grid-render-wrap.js
          update = (trs,ths) ~>
            head.innerHTML = ths
            if head-only => return res!
            content.innerHTML = ""
            if @data.clusterizer => that.destroy true
            @data.clusterizer = new Clusterize do
              rows: trs
              scrollElem: scroll
              contentElem: content
            res!
          if trs and ths => return update trs, ths

          @worker.onmessage = (e) ~>
            [trs, ths] = [e.data.trs, e.data.ths]
            update trs, ths

          if head-only =>
            @worker.postMessage {headers: @data.headers, types: @data.types}
          else
            @worker.postMessage {headers: @data.headers, rows: @data.rows, types: @data.types}

      update: (r,c,val) ->
        dirty = false
        if c >= @data.headers.length =>
          for i from @data.headers.length to c => @data.headers[i] = ''
        if r >= @data.rows.length =>
          for i from @data.rows.length to r => @data.rows[i] = []
        if r == -1 =>
          if !@data.headers[c] and !val => return
          @data.headers[c] = val
        if r >= 0 and !@data.rows[][r][c] and !val => return

        if c >= @data.[]types.length and val =>
          for i from @data.types.length to c=>
            @data.types[i] = plotdb.Types.resolve [@data.rows[j][i] for j from 0 til @data.rows.length]
            @data.headers[i] = (if @data.headers[i] => that else '')
          dirty = true

        if r >= 0 =>
          @data.rows[r][c] = val
          valtype = plotdb.Types.resolve val
          if valtype != @data.types[c] =>
            @data.types[c] = plotdb.Types.resolve [@data.rows[i][c] for i from 0 til @data.rows.length]
            dirty = true

        for i from @data.rows.length - 1 to 0 by -1
          if @data.rows[i].filter(->it).length => break
        @data.rows.splice i + 1
        for i from @data.types.length - 1 to 0 by -1
          if @data.rows.filter(->it[i]).length or @data.headers[i] => break
        if i < @data.types.length - 1 =>
          @data.headers.splice i + 1,1
          @data.rows.map (row) -> row.splice i + 1,1
          @data.types.splice i + 1
          dirty = true

        if dirty => @render {head-only: true} .then ->
          if r < 0 =>
            node = document.querySelector(
              '#dataset-editbox .sheet-head > div >' + " div:nth-of-type(#{c + 1}) > div:first-child"
            )
          else
            node = document.querySelector([
              '#dataset-editbox .sheet-cells >'
              "div:nth-of-type(#{r + 1}) >"
              "div:nth-of-type(#{c + 1})"
            ].join(" "))
          if node =>
            node.focus!
            range = document.createRange!
            try
              range.setStart node, 1 # set cursor, offset to text end
            catch
              range.setStart node, 0
            range.collapse true
            sel = window.getSelection!
            sel.removeAllRanges!
            sel.addRange range

      empty: ->
        @data.headers = []
        @data.rows = []
        @render!
      init: ->
        @empty!
        head = document.querySelector '#dataset-editbox .sheet .sheet-head'
        scroll = document.querySelector '#dataset-editbox .sheet .clusterize-scroll'
        content = document.querySelector '#dataset-editbox .sheet .clusterize-content'
        scroll.addEventListener \scroll, (e) -> head.scrollLeft = scroll.scrollLeft
        head.addEventListener \click, (e) ~>
          if /closebtn/.exec e.target.className =>
            data = $scope.grid.data
            col = +e.target.getAttribute(\col)
            <- $scope.$apply
            eventBus.fire \loading.dimmer.on
            $timeout (->
              data.headers.splice col,1
              data.rows.map (row) -> row.splice col,1
              data.types.splice col, 1
              $scope.grid.render!then -> $scope.$apply -> eventBus.fire \loading.dimmer.off
            ), 0
          else =>
            col = +e.target.getAttribute(\col)
            if !isNaN(col) =>
              node = head.querySelector ".sheet-head > div > div:nth-of-type(#{col + 1}) > div:first-child"
              if node => that.focus!
        head.addEventListener \keydown, (e) ~>
          setTimeout (~>
            key = e.keyCode
            n = e.target
            val = n.textContent.trim!
            col = +n.getAttribute(\col)
            if key >=37 and key <=40 =>
              v = [[-1 0],[0 -1],[1 0],[0 1]][key - 37]
              if v.1 > 0 =>
                node = content.querySelector([
                  ".sheet-cells >"
                  "div:first-child >"
                  "div:nth-of-type(#{col + 1 + v.0})"
                ].join(" "))
              else
                node = head.querySelector([
                  ".sheet-head > div:first-child >"
                  "div:nth-of-type(#{col + 1 + v.0}) > div:first-child"
                ].join(" "))
              if node => that.focus!
            else $scope.$apply ~> @update -1, col, val
          ), 0
        content.addEventListener \keydown, (e) ~>
          setTimeout (~>
            key = e.keyCode
            n = e.target
            val = n.textContent
            row = +n.getAttribute(\row)
            col = +n.getAttribute(\col)
            h = col
            if key >=37 and key <=40 =>
              v = [[-1 0],[0 -1],[1 0],[0 1]][key - 37]
              if row == 0 and v.1 < 0 =>
                node = head.querySelector([
                  ".sheet-head > div >"
                  "div:nth-of-type(#{col + 1}) > div:first-child"
                ].join(" "))
              else
                node = content.querySelector([
                  ".sheet-cells >"
                  "div:nth-of-type(#{row + 1 + v.1}) >"
                  "div:nth-of-type(#{col + 1 + v.0})"
                ].join(" "))
              if node => that.focus!
            else $scope.$apply ~> @update row, h, val
          ), 0

    $scope.init!
    $scope.grid.init!
    $scope.parser.gsheet.init!
