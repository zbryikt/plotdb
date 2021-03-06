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

    $scope.copy = do
      toggle: (state) ->
        if !(state?) => @toggled = !!!@toggled
        else @toggled = state
      init: ->
        <[#dataset-copy-btn]>.map (eventsrc) ~>
          clipboard = new Clipboard eventsrc, do
            text: (trigger) ->
              if $scope.grid.toggled =>
                data = $scope.grid.data
                data = data.headers.join(\\t) + \\n + data.rows.map(->it.join(\\t)).join(\\n)
                return data
              else return $scope.rawdata
          clipboard.on \success, ->
            $(eventsrc).tooltip({title: 'copied', trigger: 'click'}).tooltip('show')
            setTimeout((->$(eventsrc).tooltip('hide')), 2000)
          clipboard.on \error, -> $scope.$apply -> $scope.copy.toggle!
        document.body.addEventListener \keydown, (e) ->
          if (e.keyCode == 67 or e.key == "c") and e.metaKey => $scope.$apply ->
            if $scope.copy.toggled =>
              $('#dataset-copy-btn').tooltip({title: 'Copied', trigger: 'click'}).tooltip('show')
              setTimeout((->$('#dataset-copy-btn').tooltip('hide')), 2000)
            $scope.copy.toggle false

    eventBus.listen \dataset.save, (name) ->
      if !$scope.dataset => $scope.dataset = new data-service.dataset!
      if !$scope.dataset.key or !$scope.dataset.name => $scope.dataset.name = name
      $scope.save(false, false, false)
        .then ->
          $http({
            url: "/d/dataset/#{$scope.dataset.key}/simple"
            method: \GET
          }).success((dataset) ->
            dataset.fields.map (d,i) ->  $scope.dataset.fields[i].key = d.key
            eventBus.fire \dataset.saved, $scope.dataset
          )
        .catch ->
          plNotify.send \warning, "not dataset owner, dataset won't be updated"
          eventBus.fire \loading.dimmer.off
          console.log $scope.dataset
          if $scope.dataset.key => eventBus.fire \dataset.saved, $scope.dataset

    $scope.save = (locally = false, redirect-if-new = true, handle-fail = true) ->
      if !$scope.dataset => return Promise.resolve!
      if !$scope.user.authed! => 
        $scope.auth.toggle true
        return Promise.resolve!
      promise = if !$scope.dataset.name =>
        $scope.panel.name.prompt!
      else 
        Promise.resolve!
      <- promise.then _
      $scope.$apply -> eventBus.fire \loading.dimmer.on
      promise = null
      if $scope.grid.toggled => promise = Promise.resolve!
      else $scope.$apply -> promise = $scope.parser.csv.read($scope.rawdata, false)
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
      promise = $scope.dataset.save!
      promise
        .then (r) ->
          console.log "(", r, ")", $scope.dataset
          $scope.$apply -> plNotify.send \success, "dataset saved"
          if is-create =>
            if $scope.$parent and $scope.$parent.inline-create =>
              $scope.$parent.inline-create $scope.dataset
              $scope.$apply -> eventBus.fire \loading.dimmer.off
            else
              if redirect-if-new => setTimeout (->
                window.location.href = data-service.link $scope.dataset
              ), 1000
          else
            $scope.$apply -> eventBus.fire 'loading.dimmer.off'
          eventBus.fire \dataset.saved, $scope.dataset
        .catch (e) -> $scope.$apply ->
          eventBus.fire 'loading.dimmer.off'
          if handle-fail => 
            if e.2 == 402 =>
              eventBus.fire \quota.widget.on
              plNotify.send \danger, "Failed: Quota exceeded"
            else
              console.log \zzz
              console.log e.stack
              plNotify.aux.error.io \save, \data, e
      promise

    $scope.load = (_type, key) -> new Promise (res, rej) ->
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
          console.log $scope.grid.data.fieldize!
          res!
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

    $scope.download = do
      prepare: -> @queue = <[csv]>.map (n,i) ~>
        name = {csv: ".. as CSV"}
        alt = {}
        postfix = <[csv]>
        ret = do
          state: 0, name: name[n], alt: alt[n]
          filename: (($scope.dataset or {}).name or 'untitled') + ".#{postfix[i]}"
        if i < 1 or ($scope.user.data and $scope.user.data.{}payment.plan > 0) or (plConfig.mode % 2) =>
          setTimeout (~> $scope.$apply ~> [@[n].url = '', @[n]!]), 300
          return ret
        return ret <<< {state: 3}
      csv: ->
        data = $scope.grid.data
        data = ([data.headers] ++ data.rows)
          .map -> it.map(-> """\"#{it.replace(/"/g,"\\\"")}\"""").join(\,)
          .join \\n
        #data = data.headers.mapjoin(\,) + \\n + data.rows.map(->it.join(\,)).join(\\n)
        @queue.0 <<< do
          url: URL.createObjectURL new Blob [data], {type: \text/csv}
          size: data.length
          state: 2
      queue: [{}]:
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

    $scope.parser.plotdb = do
      toggle: (v) -> @toggled = (if v? => v else !!!@toggled)
      toggled: false
      load: (dataset) ->
        eventBus.fire \loading.dimmer.on, 1
        $scope.parser.progress 3000
        $scope.load dataset._type, dataset.key .then ~>
          @toggle false
          eventBus.fire \loading.dimmer.off
        
    $scope.parser.csv = do
      encodings: <[UTF-8 BIG5 GB2312 ISO-8859-1]>
      encoding: \UTF-8
      worker: null
      toggle: (v) -> @toggled = (if v? => v else !!!@toggled)
      toggled: false
      askencoding: ->
        $scope.parser.csv.callback = it
        $scope.parser.csv.toggle true
      gotencoding: -> @callback!
      import: (buf,file={}) ->
        if file.name and !/\.csv$/.exec(file.name) =>
          alert("it's not a CSV file")
          return
        node = (
          document.getElementById(\dataset-import-dropdown) or
          document.getElementById(\dataset-import-dropdown-inline)
        )
        node.className = node.className.replace /open/, ''
        $scope.parser.csv.buf = buf
        $scope.parser.csv.toggle false
        $scope.parser.csv.read!
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
          $scope.grid.render!then ~> $scope.$apply ~>
            @toggle false
            @buf = null
            if verbose => eventBus.fire \loading.dimmer.off
            $scope.loading = false
            res!
        @worker.postMessage {buf}
        #$scope.reset buf.trim! #utf8.decode(buf).trim!

    $scope.parser.xls = do
      worker: null
      sheets: do
        toggled: false
        toggle: ->
          @toggled = if it? => it else !!!@toggled
          if !@toggled and @promise =>
            res = @promise.res
            @promise = null
            res!
        list: []
        title: null
        choose: ->
          @title = it
          $scope.parser.progress $scope.parser.xls.sec
          eventBus.fire \loading.dimmer.on, 1
          @toggle false
          $scope.parser.xls.worker.postMessage {type: \get-sheet, buf: $scope.parser.xls.buf, sheetName: @title}

      read: (buf,file) ->
        xls = $scope.parser.xls
        xls.sheets.title = null
        xls.buf = buf
        if file.name and !/\.xlsx?/.exec(file.name) =>
          alert("it's not a Microsoft Excel file")
          return
        eventBus.fire \loading.dimmer.on, 1
        xls.sec = sec = buf.length * 2.5 / 1000
        $scope.parser.progress sec
        if !xls.worker =>
          xls.worker = new Worker \/js/data/worker/excel.js
          xls.worker.onmessage = (e) ~> $scope.$apply ~>
            if e.data.type == \sheet-list =>
              xls.sheets.toggle true
              xls.sheets.list = e.data.data
              eventBus.fire \loading.dimmer.off
            if e.data.type == \sheet =>
              data = e.data.data
              $scope.grid.data.headers = data.headers
              $scope.grid.data.rows = data.rows
              $scope.grid.data.types = data.types
              $scope.grid.data.size = buf.length
              $scope.grid.render!then -> # 1.3
                $scope.$apply ->
                  eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
                  eventBus.fire \loading.dimmer.off

        node = (
          document.getElementById(\dataset-import-dropdown) or
          document.getElementById(\dataset-import-dropdown-inline)
        )
        node.className = node.className.replace /open/, ''
        $timeout (~> xls.worker.postMessage {type: \get-sheet-list, buf}), 100

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
        if !gapi? => return
        gapi.load 'client:auth2', ~>
          gapi.client.load 'drive', 'v3'
          gapi.client.set-api-key @api-key
          gapi.auth2.init do
            client_id: @client-id
            scope: @scopes
          Paging.load-on-scroll (-> $scope.parser.gsheet.list!), \#gsheet-list-end, \#gsheet-files
          $scope.$watch 'parser.gsheet.title', (n,o) ~> if n != o => @list true
      files: []
      auth: ->
        if !gapi? => return
        auth = gapi.auth2.get-auth-instance!
        if auth.is-signed-in.get! => return auth
        else
          eventBus.fire \loading.dimmer.on
          return auth.sign-in!
      list: (flush = false)->
        if @loading => return
        @loading = true
        <~ @auth!then
        eventBus.fire \loading.dimmer.off
        config = do
          pageSize: 40,
          fields: "nextPageToken, files(id, name)"
          q: "mimeType='application/vnd.google-apps.spreadsheet'" + (if @title => " and name contains '#{@title}'" else '')
        if @pageToken => config.pageToken = @pageToken
        request = gapi.client.drive.files.list config
        request.execute (ret) ~>
          if flush => @files = []
          @pageToken = ret.nextPageToken
          $scope.$apply ~>
            @files ++= ret.[]files.map -> {file: it}
            @loading = false
      toggle: ->
        @toggled = if it? => it else !!!@toggled
        if @toggled and !@files.length => @list!
      sheets: do
        toggled: false
        toggle: ->
          @toggled = if it? => it else !!!@toggled
          if !@toggled and @promise =>
            res = @promise.res
            @promise = null
            res!
        list: []
        title: null
        promise: null
        load: (file) ->
          gapi.client.sheets.spreadsheets.get do
            spreadsheetId: file.id
          .then (ret) ~>
            @list = ret.result.sheets.map(->it.properties.title)
            if @list.length == 1 =>
              @title = @list.0
              return Promise.resolve!
            eventBus.fire \loading.dimmer.off
            $scope.parser.gsheet.toggle false
            @toggle true
            new Promise (res, rej) ~> @promise = {res, rej}
      load: (file) ->
        file = file.file
        eventBus.fire \loading.dimmer.on, 1
        $scope.parser.progress 3000
        gapi.client.load 'https://sheets.googleapis.com/$discovery/rest?version=v4'
          .then -> $scope.parser.gsheet.sheets.load file
          .then ~> @toggle false
          .then ~>
            eventBus.fire \loading.dimmer.on, 1
            $scope.parser.progress 3000
            gapi.client.sheets.spreadsheets.values.get do
              spreadsheetId: file.id
              range: "#{@sheets.title}!A:ZZ"
          .then(
            ((ret) ~>
              list = ret.result.values
              list = list.filter(->it.filter(->(it or "").trim!length).length)
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
                  eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
            ),
            (-> $scope.$apply ~>
              plNotify.send \danger, "can't load sheet, try again later?"
              eventBus.fire \loading.dimmer.off
            )
          )

    $scope.panel = do
      name: do
        promise: null
        focus: -> if @toggled => if document.getElementById(\dataset-name-input) => that.focus!
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
    eventBus.listen \dataset.update.fields, (data, dimkeys) ->
      $scope.grid.data.headers = [v.name for v in data]
      $scope.grid.data.rows = data.0.data.map((d,i)->data.map((e)->e.data[i]))
      $scope.grid.data.types = plotdb.Types.resolve $scope.grid.data
      $scope.grid.data.bind = [v.bind for v in data]
      $scope.grid.data.dimkeys = dimkeys
      $scope.grid.render!

    eventBus.listen \dataset.sample, (data, dimkeys) ->
      $scope.grid.data.headers = h = [k for k,v of data.0]
      $scope.grid.data.rows = data.map((d)-> h.map(->d[it]))
      $scope.grid.data.types = plotdb.Types.resolve $scope.grid.data
      $scope.grid.data.dimkeys = dimkeys
      $scope.grid.render!
    eventBus.listen \dataset.load (key, dimkeys, bind) ->
      $scope.grid.data.dimkeys = dimkeys
      $scope.grid.data.bind = [[k,v] for k,v of bind].sort((a,b) -> a.0 - b.0).map(->it.1)
      $scope.load {location: \server, name: \dataset}, key
        .then ->
          console.log \456,$scope.grid.data.fieldize!
          eventBus.fire \dataset.changed, $scope.grid.data.fieldize!

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
        bind: []
        dimkeys: []
        clusterizer: null
        bind-field: (e)->
          node = e.target or e.srcElement
          if node.nodeName.toLowerCase! != \a => return
          dim = node.getAttribute(\data-dim) or ''
          multi = (node.getAttribute(\data-multi) or 'false') == 'true'
          if dim and !multi => for i from 0 til @bind.length =>
            if @bind[i] == dim => @bind[i] = null
          index = Array.from(node.parentNode.parentNode.parentNode.parentNode.childNodes)
            .indexOf(node.parentNode.parentNode.parentNode)
          @bind[index] = dim or null
          root = node.parentNode.parentNode.parentNode.parentNode
          @bind-field-sync!
          eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
        bind-field-sync: ->
          root = document.querySelector('#dataset-editbox .sheet .sheet-dim > div')
          if !root or !root.childNodes => return
          for i from @headers.length til root.childNodes.length =>
            span = root.childNodes[i].querySelector("span")
            span.innerText = "(empty)"
            span.className = 'grayed'
            @bind[i] = null
          for i from 0 til @headers.length =>
            if !root.childNodes[i] => continue
            span = root.childNodes[i].querySelector("span")
            span.innerText = @bind[i] or "(empty)"
            span.className = if @bind[i] => '' else 'grayed'

        fieldize: ->
          ret = @headers.map (d,i) ~> { data: [], datatype: @types[i], name: d, bind: @bind[i] }
          for i from 0 til @rows.length =>
            for j from 0 til @headers.length => ret[j].data.push @rows[][i][j]
          return ret

      render: (obj = {}) ->
        {head-only,ths,trs} = obj
        return new Promise (res, rej) ~>
          dim = document.querySelector '#dataset-editbox .sheet .sheet-dim'
          head = document.querySelector '#dataset-editbox .sheet .sheet-head'
          scroll = document.querySelector '#dataset-editbox .sheet .clusterize-scroll'
          content = document.querySelector '#dataset-editbox .sheet .clusterize-content'
          rowcount = +head.getAttribute(\data-rowcount) or 10
          if !@worker => @worker = new Worker \/js/data/worker/grid-render-wrap.js
          update = (trs,ths,dimnode) ~>
            if dim => dim.innerHTML = dimnode
            head.innerHTML = ths
            if head-only => return res!
            content.innerHTML = ""
            if @data.clusterizer => that.destroy true
            @data.clusterizer = new Clusterize do
              rows: trs
              scrollElem: scroll
              contentElem: content
            @data.bind-field-sync!
            res!
          if trs and ths => return update trs, ths

          @worker.onmessage = (e) ~>
            [trs, ths, dimnode] = [e.data.trs, e.data.ths, e.data.dim]
            update trs, ths, dimnode

          if head-only =>
            @worker.postMessage {
              headers: @data.headers,
              types: @data.types,
              bind: @data.bind,
              dimkeys: @data.dimkeys,
              rowcount: rowcount
            }
          else
            @worker.postMessage {
              headers: @data.headers,
              rows: @data.rows,
              types: @data.types,
              bind: @data.bind,
              dimkeys: @data.dimkeys
              rowcount: rowcount
            }

      update: (r,c,val, head-only = true) ->
        dirty = false
        if c >= @data.headers.length and val =>
          for i from @data.headers.length to c => @data.headers[i] = ''
          head-only = false
        if r >= @data.rows.length =>
          for i from @data.rows.length to r => @data.rows[i] = []
        if r == -1 =>
          if !@data.headers[c] and !val => return
          @data.headers[c] = val

        if r >= 0 and !@data.rows[][r][c] and !val => return

        if c >= @data.[]types.length and val =>
          for i from @data.types.length to c =>
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

        eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
        if dirty => @render {head-only: head-only} .then ->
          if r < 0 =>
            node = document.querySelector(
              '#dataset-editbox .sheet-head > div >' + " div:nth-of-type(#{c + 1}) > textarea:first-child"
            )
          else
            node = document.querySelector([
              '#dataset-editbox .sheet-cells >'
              "div:nth-of-type(#{r + 1}) >"
              "div:nth-of-type(#{c + 1}) textarea"
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
        dim = document.querySelector '#dataset-editbox .sheet .sheet-dim'
        scroll = document.querySelector '#dataset-editbox .sheet .clusterize-scroll'
        content = document.querySelector '#dataset-editbox .sheet .clusterize-content'
        scroll.addEventListener \scroll, (e) ->
          head.scrollLeft = scroll.scrollLeft
          if dim and dim.childNodes.0 => dim.childNodes.0.style.left = "#{-scroll.scrollLeft}px"
        content.addEventListener \click, (e) ~>
          if /closebtn/.exec e.target.className =>
            data = $scope.grid.data
            row = +e.target.getAttribute(\row)
            <- $scope.$apply
            $timeout (->
              eventBus.fire \loading.dimmer.on
              data.rows.splice row, 1
              $scope.grid.render!then -> $scope.$apply ->
                eventBus.fire \loading.dimmer.off
                eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
            ), 0
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
              data.bind.splice col, 1
              $scope.grid.render!then -> $scope.$apply ->
                eventBus.fire \loading.dimmer.off
                eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
            ), 0
          else =>
            col = +e.target.getAttribute(\col)
            if !isNaN(col) =>
              node = head.querySelector ".sheet-head > div > div:nth-of-type(#{col + 1}) > div:first-child"
              if node => that.focus!
        head.addEventListener \keydown, (e) ~>
          pPos = e.target.selectionStart
          key = e.keyCode
          n = e.target
          val = n.value.trim! or n.textContent.trim!
          if key == 86 and e.metaKey or e.ctrlKey and /\t/.exec(val) => return n.value = ""
          setTimeout (~>
            val = n.value.trim! or n.textContent.trim!
            cPos = e.target.selectionStart
            col = +n.getAttribute(\col)
            if key == 39 and (pPos != cPos or cPos < val.length) => return
            if key == 37 and (pPos != cPos or cPos > 0) => return
            if key == 86 and e.metaKey or e.ctrlKey and /\t/.exec(val) => @paste -1, col, val
            else if key >=37 and key <=40 =>
              v = [[-1 0],[0 -1],[1 0],[0 1]][key - 37]
              if v.1 > 0 =>
                node = content.querySelector([
                  ".sheet-cells >"
                  "div:first-child >"
                  "div:nth-of-type(#{col + 1 + v.0}) textarea"
                ].join(" "))
              else
                node = head.querySelector([
                  ".sheet-head > div:first-child >"
                  "div:nth-of-type(#{col + 1 + v.0}) > textarea:first-child"
                ].join(" "))
              if node => that.focus!
            else $scope.$apply ~> @update -1, col, val
          ), 0

        head.addEventListener \input, (e) ~>
          key = e.keyCode
          n = e.target
          val = n.value or n.textContent
          col = +n.getAttribute(\col)
          if /\t/.exec(val) => @paste -1, col, val

        content.addEventListener \input, (e) ~>
          key = e.keyCode
          n = e.target
          val = n.value or n.textContent
          row = +n.getAttribute(\row)
          col = +n.getAttribute(\col)
          if /\t/.exec(val) => @paste row, col, val

        content.addEventListener \keydown, (e) ~>
          pPos = e.target.selectionStart
          key = e.keyCode
          n = e.target
          val = n.value or n.textContent
          if key == 86 and e.metaKey or e.ctrlKey and /\t/.exec(val) => return n.value = ""
          setTimeout (~>
            val = n.value or n.textContent
            cPos = e.target.selectionStart
            row = +n.getAttribute(\row)
            col = +n.getAttribute(\col)
            h = col
            if key == 39 and (pPos != cPos or cPos < val.length) => return
            if key == 37 and (pPos != cPos or cPos > 0) => return
            else if key >=37 and key <=40 =>
              v = [[-1 0],[0 -1],[1 0],[0 1]][key - 37]
              if row == 0 and v.1 < 0 =>
                node = head.querySelector([
                  ".sheet-head > div >"
                  "div:nth-of-type(#{col + 1}) > textarea:first-child"
                ].join(" "))
              else
                node = content.querySelector([
                  ".sheet-cells >"
                  "div:nth-of-type(#{row + 1 + v.1}) >"
                  "div:nth-of-type(#{col + 1 + v.0}) textarea"
                ].join(" "))
              if node => that.focus!
            else $scope.$apply ~> @update row, h, val
          ), 0
      paste: (row,col,val) ->
        head = null
        eventBus.fire \loading.dimmer.on
        data = $scope.grid.data
        ret = val.split(\\n).map -> it.split \\t
        if row == -1 =>
          head = ret.splice(0, 1).0
          row = 0
        w = Math.max.apply null, ret.map(->it.length)
        h = ret.length
        cur-row-size = data.rows.length
        cur-col-size = data.headers.length
        new-row-size = if row + h - 1 < cur-row-size => cur-row-size else row + h - 1
        new-col-size = if col + w - 1 < cur-col-size => cur-col-size else col + w - 1
        if new-col-size > cur-col-size =>
          for i from cur-col-size til new-col-size => data.headers[i] = ""
        if head => for i from 0 til w => data.headers[i + col] = head[i]
        if new-row-size > cur-row-size => data.rows.push ["" for i from 0 til new-col-size]
        for r from 0 til h => for c from 0 til w =>
          data.rows[][r + row][c + col] = ret[r][c]
        for i from col til col + w =>
          data.types[i] = plotdb.Types.resolve [data.rows[j][i] for j from 0 til data.rows.length]
        $scope.grid.render!then ->
          eventBus.fire \loading.dimmer.off
          eventBus.fire \dataset.changed, $scope.grid.data.fieldize!
        

    $scope.init!
    $scope.copy.init!
    $scope.grid.init!
    $scope.parser.gsheet.init!
