angular.module \plotDB
  ..controller \dataEditCtrl,
  <[$scope $interval $timeout $http dataService eventBus plNotify Paging]> ++
  ($scope, $interval, $timeout, $http, data-service, eventBus, plNotify, Paging) ->
    eventBus.fire \loading.dimmer.on
    $scope <<< do
      rawdata: ""
      dataset: null
      worker: new Worker("/js/data/worker.js")
      loading: true
      inited: false
      show-grid: true
    $scope.$watch 'inited', ->
      eventBus.fire "loading.dimmer.#{if it => \off else \on}"
    $scope.name = null
    $scope.save = (locally = false) ->
      if !$scope.dataset or !$scope.dataset.name => return
      if !$scope.user.authed! => return $scope.auth.toggle true
      column-length = [k for k of $scope.parse.{}result].length
      if column-length >= 40 =>
        return plNotify.send \danger, "maximal 40 columns is allowed. you have #{column-length}"
      <- $scope.parse.run true .then
      $scope.dataset._type.location = (if locally => \local else \server)
      #TODO permission interface. data are now default publish
      $scope.dataset.permission = {"list": [], "switch": "publish"}
      $scope.dataset.set-fields $scope.parse.result
      is-create = if !$scope.dataset.key => true else false
      $scope.loading = true
      $scope.dataset.save!
        .then (r) ->
          $scope.loading = false
          $scope.$apply -> plNotify.send \success, "dataset saved"
          if is-create =>
            if $scope.$parent and $scope.$parent.inline-create =>
              $scope.$parent.inline-create $scope.dataset
            else
              $scope.$apply -> eventBus.fire 'loading.dimmer.on'
              setTimeout (->
                window.location.href = data-service.link $scope.dataset
              ), 1000
          eventBus.fire \dataset.saved, $scope.dataset
        .catch (e) ->
          console.log e.stack
          $scope.loading = false
          $scope.$apply -> plNotify.aux.error.io \save, \data, e
    $scope.load = (_type, key) ->
      $scope.rawdata = ""
      data-service.load _type, key
        .then (ret) ~>
          <- $scope.$apply
          $scope.dataset = new data-service.dataset ret
          $scope.parse.revert $scope.dataset
          $scope.inited = true
        .catch (ret) ~>
          <- $scope.$apply
          console.error ret
          plNotify.send \error, "failed to load dataset. please try reloading"
          #TODO check at server time?
          if ret.1 == \forbidden => window.location.href = \/403.html #window.location.pathname
          $scope.inited = true
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
      reset: (rawdata) ->
        dataset = new dataService.dataset(window.dataset or {})
        if $scope.dataset and $scope.dataset.name => dataset.name = $scope.dataset.name
        $scope <<< {dataset, rawdata}
        #if $scope.rawdata == rawdata => $scope.parse.run!
        $scope.parse.run!
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
        else $scope.inited = true
        #$scope.$watch 'rawdata', -> $scope.parse.run!
        $(\#dataset-edit-text).on \keydown, -> $scope.$apply -> $scope.parse.run!
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
      run: (force = false) -> new Promise (res, rej) ~>
        $scope.loading = true
        _ = ~>
          $scope.parser.csv.read $scope.rawdata, false
          /*
          @ <<< {handle: null, result: {}, size: $scope.rawdata.length}
          Papa.parse ($scope.rawdata or ""), do
            worker: true, header: true
            step: ({data: rows}) ~>
              for row in rows => for k,v of row => @result[][k].push v
            complete: ~>
              data = $scope.grid.data
              values = [v for k,v of @result] or []
              data.headers = [k for k of @result]
              len = @result[][data.headers.0].length
              data.rows = [{} for i from 0 til len]
              data.rows.map (row,i) ~> data.headers.map ~> row[it] = @result[it][i]
              <~ $scope.grid.render!then
              <~ $scope.$apply
              @ <<< {fields: values.length, rows: (values.0 or []).length}
              $scope.loading = false
              if @rows > 0 and !$scope.dataset.name => $('#dataset-editbox-meta .input-group input').tooltip('show')
              res @result
              if $scope.dimming == true =>
                $scope.dimming = false
                eventBus.fire \loading.dimmer.off
          */
        if @handle => $timeout.cancel @handle
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
      read: (buf,verbose = true) ->
        if !(buf?) => buf = @buf
        if verbose => eventBus.fire \loading.dimmer.on, 1
        sec = buf.length * 1.3 / 1000
        $scope.parser.progress sec
        $scope.dimming = true
        if !@worker => @worker = new Worker \/js/data/worker/csv.js
        @worker.onmessage = (e) ~>
          $scope.$apply ~>
            $scope.grid.data.rows = e.data.rows
            $scope.grid.data.headers = e.data.headers
            $scope.grid.data.size = buf.length
          $scope.grid.render!then ~>
            @toggle false
            @buf = null
            eventBus.fire \loading.dimmer.off
            $scope.loading = false
        @worker.postMessage buf  
        #$scope.reset buf.trim! #utf8.decode(buf).trim!

    $scope.parser.xls = do
      worker: null
      read: (buf) ->
        eventBus.fire \loading.dimmer.on, 1
        sec = buf.length * 1.7 / 1000
        $scope.parser.progress sec
        if !@worker =>
          @worker = new Worker \/js/data/worker/excel.js
          @worker.onmessage = (e) -> $scope.$apply ->
            $scope.grid.data.headers = e.data.headers
            $scope.grid.data.rows = e.data.rows
            $scope.grid.data.size = buf.length
            $scope.grid.render!then -> # 1.3
              $scope.$apply -> eventBus.fire \loading.dimmer.off
        node = document.getElementById(\dataset-import-dropdown)
        node.className = node.className.replace /open/, ''
        $timeout (~> @worker.postMessage buf ), 100

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
                #data.rows = list.map (v) ->
                #  hash = {}
                #  for i from 0 til v.length => hash[h[i]] = v[i]
                #  hash
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
      toggle: (name) ->
        if !$scope.{}dataset.key =>
          if !name => return
        if name =>
          @{}[name]toggled = !!!@{}[name]toggled
        else @toggled = !!! @toggled
    eventBus.listen \dataset.delete, (key) -> if $scope.dataset.key == key => $scope.dataset = null
    eventBus.listen \dataset.edit, (dataset, load = true) ->
      #TODO: support more type ( currently CSV structure only )
      #TODO: refactor window heigh
      $scope.inited = false
      if load and dataset._type.location == \server =>
        $scope.load dataset._type, dataset.key
      else
        $scope.dataset = new data-service.dataset dataset
        $scope.parse.revert $scope.dataset
        $scope.inited = true

    # dev
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
        h = @data.headers
        list = []
        lastidx = 0
        for i from 0 til @data.rows.length =>
          row = @data.rows[i]
          #row = h.map(->row[it])
          if row.join('') => lastidx = i
          list.push h.map((d,i)->
            it = row[i]
            if !it => return it
            it = it.replace(/"/g,'""')
            if /[ ,\n\t]/.exec(it) => it = "\"#it\""
            return it
          ).join(\,)
        list.splice lastidx + 1
        ret = [
          @data.headers.join(\,)
          list.join(\\n)
        ].join(\\n)
        $scope.rawdata = ret
      worker: null
      data: do
        rows: []
        headers: []
        trs: []
        clusterizer: null
      render: ->
        return new Promise (res, rej) ~>
          head = document.querySelector '#dataset-editbox .sheet .sheet-head'
          scroll = document.querySelector '#dataset-editbox .sheet .clusterize-scroll'
          content = document.querySelector '#dataset-editbox .sheet .clusterize-content'
          if !@worker => @worker = new Worker \/js/data/worker/grid-render.js
          @worker.onmessage = (e) ~>
            content.innerHTML = ""
            [trs, ths] = [e.data.trs, e.data.ths]
            head.innerHTML = ths
            if @data.clusterizer => that.destroy true
            @data.clusterizer = new Clusterize do
              rows: trs
              scrollElem: scroll
              contentElem: content
            scroll.addEventListener \scroll, (e) -> head.scrollLeft = scroll.scrollLeft
            head.addEventListener \keydown, (e) ~>
              setTimeout (~>
                n = e.target
                val = n.textContent.trim!
                col = +n.getAttribute(\col)
                @update -1, col, val
              ), 0
            content.addEventListener \keydown, (e) ~>
              setTimeout (~>
                n = e.target
                val = n.textContent
                row = +n.getAttribute(\row)
                col = +n.getAttribute(\col)
                h = col #h = @data.headers[col]
                @update row, h, val
              ), 0
            res!
          @worker.postMessage {headers: @data.headers, rows: @data.rows}

      update: (r,c,val) ->
        if c >= @data.headers.length =>
          for i from @data.headers.length to c => @data.headers[i] = ''
        if r >= @data.rows.length =>
          for i from @data.rows.length to r => @data.rows[i] = []
        if r == -1 => @data.headers[c] = val
        else @data.rows[r][c] = val

      empty: ->
        @data.headers = []
        @data.rows = []
        @render!

    $scope.init!
    $scope.grid.empty!
    $scope.parser.gsheet.init!
