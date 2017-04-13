# eventBus host <-> plSheet
# -> sheet.dataset.load          | key, bindmap, force
# -> sheet.dataset.parse         | key, bindmap, force
# -> sheet.bind                  | dimkeys, bind
# <- sheet.dataset.saved         | key
# <- sheet.dataset.save.failed   |
# <- sheet.dataset.loaded        | key
# <- sheet.dataset.parsed        | key
# -> sheet.data.set              | data
# -> sheet.grid.isClear.get      |
# <- sheet.grid.isClear
# -> sheet.grid.load
# <- sheet.grid.loaded           | data

angular.module \plotDB
  ..controller \plSheetEditor,
  <[$scope $interval $timeout $http permService dataService eventBus plNotify Paging initWrap]> ++
  ($scope, $interval, $timeout, $http, permService, data-service, eventBus, plNotify, Paging, initWrap) ->
    initWrap = initWrap!
    $scope.sheetModal = do
      duplicate: {}
    $scope.dataset = initWrap do
      init: ->
        eventBus.listen \sheet.dataset.load, (key, bindmap, force) ~>
          @load key, force .then ~> eventBus.fire \sheet.dataset.loaded, key
        eventBus.listen \sheet.dataset.parse, (key, bindmap, force) ~>
          @load key, force
            .then ~> $scope.parser.plotdb.parse @obj, bindmap
            .then (dataset) ~> eventBus.fire \sheet.dataset.parsed, dataset
        eventBus.listen \sheet.dataset.save, (name) ~> @save name
      obj: null
      clear: -> @obj = null
      save: (name = 'Untitled') -> 
        name = "#name (Dataset)"
        fresh = if @obj => !!!@obj.key else !!!@obj
        Promise.resolve!
          .then ~>
            if !$scope.user.authed! => 
              $scope.auth.toggle true
              return Promise.reject!
            if fresh =>
              @obj = new data-service.dataset!
              @obj.name = name
            @obj.set-fields $scope.grid.data.fieldize!
            if @obj.fields.length >= 40 =>
              alert 'You can have at most 40 columns'
              @obj = null
              return Promise.reject!
            if !@obj.name => @obj.name = name else Promise.resolve!
          .then ~>
            @obj.save!catch ~>
              eventBus.fire \loading.dimmer.pause
              $scope.sheetModal.duplicate.prompt!
                .then ~>
                  fresh := true
                  @obj.key = null
                  @obj.save!
          .then (r) ~>
            eventBus.fire \loading.dimmer.continue
            if fresh =>
              new Promise (res, rej) ~>
                $http({
                  url: "/d/dataset/#{@obj.key}/simple"
                  method: \GET
                }).success((map) ~>
                  map.fields.map (d,i) ~> @obj.fields[i] <<< dataset: @obj.key, key: d.key
                  res!
                ).error(-> console.log "error:", it rej!)
            else Promise.resolve!
          .then ~>
            eventBus.fire \sheet.dataset.saved, @obj
          .catch ~> eventBus.fire \sheet.dataset.save.failed, it

      load: (key, force, location=\server) ->
        if !@obj or @obj.key != key or !force =>
          data-service.load {location: location, name: \dataset}, key
            .then (ret) ~>
              @obj = dataset = new data-service.dataset ret
              eventBus.fire \sheet.dataset.loaded, @obj
              @obj
        else Promise.resolve!then ->
          eventBus.fire \sheet.dataset.loaded, @obj
          @obj
      clone: ->
      delete: ->

    $scope.grid = initWrap do
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

      clear: true
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
          for i from 0 til 3 => 
            if node.nodeName.toLowerCase! != \a => node = node.parentNode
            else break
          if node.nodeName.toLowerCase! != \a => return
          dim = node.getAttribute(\data-dim) or ''
          action = node.getAttribute(\data-action) or 'bind'
          multi = (node.getAttribute(\data-multi) or 'false') == 'true'
          if action == \clearall =>
            for i from 0 til @bind.length => @bind[i] = null
          else
            if dim and !multi => for i from 0 til @bind.length =>
              if @bind[i] == dim => @bind[i] = null
            index = Array.from(node.parentNode.parentNode.parentNode.parentNode.childNodes)
              .indexOf(node.parentNode.parentNode.parentNode)
            @bind[index] = dim or null
          root = node.parentNode.parentNode.parentNode.parentNode
          @bind-field-sync!
          eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
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
            displayname = (@dimkeys.filter(~>it.name == @bind[i]).0 or {displayname: @bind[i]}).displayname
            span = root.childNodes[i].querySelector("span")
            span.innerText = displayname or "(empty)"
            span.className = if @bind[i] => '' else 'grayed'

        fieldize: ->
          ret = @headers.map (d,i) ~> do
            data: [], datatype: @types[i], name: d, bind: @bind[i]
            key: @keys[i], dataset: @datasets[i]
          for i from 0 til @rows.length =>
            if !@rows[i].filter(->it).length => continue
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
        eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
        if dirty => @render {head-only: head-only} .then ~>
          @clear = false
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
            if node.setSelectionRange =>
              node.setSelectionRange 1,1
            else
              range = node.createTextRange!
              range.collapse true
              range.moveEnd \character, 1
              range.moveStart \character, 1
              range.select!

      empty: (render) ->
        @data <<< headers: [], rows: [], types: [], keys: [], datasets: [], bind: []
        @clear = true
        if render => @render!
      init: ->
        eventBus.listen \sheet.grid.isClear.get ~> eventBus.fire \sheet.grid.isClear, @clear
        eventBus.listen \sheet.grid.load, ~> eventBus.fire \sheet.grid.loaded, @data.fieldize!
        eventBus.listen \sheet.bind, (dimkeys, bindmap) ~>
          @data <<< dimkeys: dimkeys, bindmap: bindmap
          @render!
          eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
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
                eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
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
                eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
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
            val = (n.value.trim! or n.textContent.trim!).replace /\n/g, ''
            cPos = e.target.selectionStart
            col = +n.getAttribute(\col)
            if key == 13 => key := 40
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
          val = n.value
          col = +n.getAttribute(\col)
          if /\t/.exec(val) => @paste -1, col, val
          else if /\n/.exec(val) => val = n.value = val.replace /\n/g, ''

        content.addEventListener \input, (e) ~>
          key = e.keyCode
          n = e.target
          val = n.value
          row = +n.getAttribute(\row)
          col = +n.getAttribute(\col)
          if /\t/.exec(val) => @paste row, col, val
          else if /\n/.exec(val) => val = n.value = val.replace /\n/g, ''

        content.addEventListener \keydown, (e) ~>
          pPos = e.target.selectionStart
          key = e.keyCode
          n = e.target
          val = n.value
          if key == 86 and e.metaKey or e.ctrlKey and /\t/.exec(val) => return n.value = ""
          if n => setTimeout (~>
            if !n.getAttribute(\col)? => return # click on non-cell element
            val = (n.value or '').replace /\n/g, ''
            cPos = e.target.selectionStart
            row = +n.getAttribute(\row)
            col = +n.getAttribute(\col)
            h = col
            if key == 13 => key := 40
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
        $scope.grid.render!then ~>
          @clear = false
          eventBus.fire \loading.dimmer.off
          eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
      load: (data, size = 0) ->
        for k in <[headers rows types keys datasets bind]> => if data[k] => @data[k] = data[k]
        @data.size = size
        if @data.bindmap =>
          @data.bind = @data.keys.map(~>@data.bindmap[it] or null)
          @data.bindmap = null
        @render!then ~>
          @clear = false
          eventBus.fire \data.rebind, true
          eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!


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

    $scope.parser.fields = initWrap do
      init: ->
        eventBus.listen \sheet.data.clear, ->
          $scope.dataset.clear!
          $scope.grid.empty true
        eventBus.listen \sheet.data.set, (data) ->
          payload = {}
            ..headers = data.map -> it.name
            ..rows = (data.0 or {data: []}).data.map (d,i) -> data.map (e,j) -> e.data[i]
            ..types = data.map -> it.datatype or \Number
            ..keys = data.map -> 0
            ..datasets = data.map -> 0
            ..bind = data.map -> it.bind
          $scope.grid.load payload

    $scope.parser.plotdb = do
      toggled: false, worker: null
      toggle: (v) -> @toggled = (if v? => v else !!!@toggled)
      parse: (dataset, bindmap = null) -> new Promise (res, rej) ~>
        if !@worker => @worker = new Worker \/js/data/worker/parse-dataset.js
        @worker.onmessage = ({data: payload}) -> $scope.$apply ->
          if bindmap => payload.data.bind = payload.data.keys.map -> bindmap[it]
          $scope.grid.empty false
          $scope.grid.load(payload.data, dataset.size).then -> res dataset
        @worker.postMessage {dataset}

      load: (dataset) ->
        eventBus.fire \loading.dimmer.on, 1
        $scope.parser.progress 3000
        $scope.dataset.load(dataset.key,true,dataset._type.location)
          .finally ~>
            @toggle false
            eventBus.fire \loading.dimmer.off
          .then ~>
            @parse it

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
        @worker.onmessage = (e) ~> $scope.$apply ~>
          data = e.data.data
          $scope.grid.empty false
          #$scope.$apply ~>
          #  $scope.grid.empty false
          #  $scope.grid.data.rows = data.rows
          #  $scope.grid.data.headers = data.headers
          #  $scope.grid.data.types = data.types
          #  $scope.grid.data.size = buf.length
          $scope.grid.load data, buf.length .then ~> $scope.$apply ~>
            @toggle false
            @buf = null
            if verbose => eventBus.fire \loading.dimmer.off
            $scope.loading = false
            #eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
            $scope.dataset.clear!
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
              $scope.grid.empty false
              data = e.data.data
              #$scope.grid.data.headers = data.headers
              #$scope.grid.data.rows = data.rows
              #$scope.grid.data.types = data.types
              #$scope.grid.data.size = buf.length
              $scope.grid.load data, buf.length .then ->
                eventBus.fire \loading.dimmer.off
                $scope.dataset.clear!

        node = (
          document.getElementById(\dataset-import-dropdown) or
          document.getElementById(\dataset-import-dropdown-inline)
        )
        node.className = node.className.replace /open/, ''
        $timeout (~> xls.worker.postMessage {type: \get-sheet-list, buf}), 100

    $scope.parser.gsheet = initWrap do
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
              head = list.splice(0,1).0
              $scope.grid.empty false
              #data = $scope.grid.data
              data = {}
              data <<< headers: head, rows: list, types: plotdb.Types.resolve data
              size = (ret.body or "").length
              $scope.grid.load data, size .then ~>
                @toggled = false
                eventBus.fire \loading.dimmer.off
                $scope.dataset.clear!

              /*
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
                  eventBus.fire \sheet.dataset.changed, $scope.grid.data.fieldize!
                  $scope.dataset.clear!
              */
            ),
            (-> $scope.$apply ~>
              plNotify.send \danger, "can't load sheet, try again later?"
              eventBus.fire \loading.dimmer.off
            )
          )

    initWrap.run!
