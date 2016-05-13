angular.module \plotDB
  ..service \dataService,
  <[$rootScope $http IOService sampleData baseService plNotify eventBus plConfig]> ++
  ($rootScope, $http, IOService, sampleData, baseService, plNotify, eventBus, plConfig) ->
    name = \dataset
    service = do
      link: (dataset) ->
        if dataset._type.location == \server => return "/dataset/#{dataset.key}/"
        return "/dataset/?k=c#{dataset.key}"
      cache: {}
      cachedLoad: (_type, key) ->
        if _type.location == \local => return @load _type, key
        if @cache[key] => Promise.resolve(@cache[key])
        @load _type, key
      list: ->
        IOService.list-remotely {name: \dataset, location: \server}
          .then (r) -> r.map -> new Dataset it
      init: -> #@list!then ~> @localinfo.update!
      localinfo: do
        rows: 0
        size: 0
        update: ->
          @ <<< {rows: 0, size: 0}
          for item in service.items => if item._type.location == \local =>
            @rows += item.rows
            @size += item.size
    # we can construct directly from a json(field), or from a dataset
    #Field = (name, dataset = null, field = null) ->
    Field = (config) ->
      @ <<< {
        dataset: null
        location: \server
        name: null
        datatype: null
        data: []
      } <<< config
      #if !field and dataset => field = dataset.fields.filter(->it.name == name).0
      #if field => @ <<< field
      # use _ as a little trick to prevent things to be stringify
      #@ <<< {name, _: ->}
      #if dataset => @set-dataset dataset
      @
    Field.prototype = do
      update: ->
        if @location == \sample => return Promise.resolve @
        data-service.cachedLoad {location: @location, name: \dataset}, @dataset
          .then (dataset) ~>
            matched = dataset.fields.filter(~>it.name == @name).0
            if !matched => return console.error "failed to update field data"
            @ <<< matched
      /*
      #toJson: -> angular.toJson(@{name, type} <<< {dataset: @dataset{type, key}})
      #TODO this might be called individually. should propagate to dataset?
      update: ->
        # failed only if remote dataset fetching failed
        (dataset) <~ @get-dataset!then
        if !dataset => return # standalone field won't need to update
        @data = dataset.[]data.map(~>it[@name])
        @settype!
      set-dataset: (dataset = null) -> # set null to clear dataset
        #if !dataset.type or !dataset.key => return Promise.reject(null)
        #(ret) <~ dataService.load dataset.type, dataset.key .then
        @_.dataset = dataset
        if dataset and dataset._type and dataset.key =>
          @dataset <<< dataset{_type, key} <<< {name: dataset.name}
        else @dataset._type <<< {_type: {}, key: null, name: null}
        Promise.resolve(dataset)
      get-dataset: -> # provide dataset or null for standalone field
        if @_.dataset => return Promise.resolve(that)
        if !@dataset._type or !@dataset.key => return Promise.resolve(null)
        (ret) <~ dataService.load @dataset._type, @dataset.key .then
        @_.dataset = ret
        @dataset <<< ret{_type, key} <<< {name: ret.name}
        @_.dataset
      settype: ->
        types = <[Boolean Percent Number Date String]> ++ [null]
        for type in types =>
          if !type => return @type = \String
          if !@data.map(-> plotdb[type]test it).filter(->!it).length =>
            @type = type
            break
      */

    #TODO: Dataset: save: update field dataset type and key
    Dataset = (config) ->
      @ <<< do
        name: "" description: ""
        type: "static", format: "csv"
        owner: null, createdtime: new Date!, modifiedtime: new Date!
        permission: { switch: [], value: []}
        fields: []
        _type: {location: \server, name: \dataset}
      @ <<< config
      @set-fields @fields
      #@fields.map ~> new Field(it <<< {dataset: @key, location: @_type.location})
      #@fields = [new Field(f.name, @, f) for f in @fields or []]
      #@save = ->
      #  @fields.map(->delete it.data)
      #  <~ Dataset.prototype.save.call(@).then
      #  @fields.map ~> it.dataset <<< @{_type,key}
      #  @update!
      #@load = ->
      #  <~ Dataset.prototype.load.call(@).then
      #  Dataset.call @
      #@update!
      @

    Dataset.prototype = do
      set-fields: (fields = null) ->
        if !fields or typeof(fields) != \object => return
        if !Array.isArray(fields) => fields = [{name: k, data: v} for k,v of fields]
        fields = fields.map ~>
          new Field it <<< {dataset: @key, datasetname: @name, location: @_type.location}
        for f1 in @fields => for f2 in fields =>
          if f1.name != f2.name => continue
          f2 <<< f1{key}
        @ <<< fields: fields, rows: @rows or (@fields.0 or {}).[]data.length, size: 0
        for f1 in @fields => @size += (f1.data or "").length + ((f1.name or "").length + 1)

      update: ->
        #if data => @data = data
        #if !@data => @data = []
        #TODO support more type
        # CSV dataset use first row as field name
        #names = [k for k of @data.0]
        /*
        promises = for i from 0 til names.length
          if @fields[i] => that else @fields.push new Field(names[i], @)
          @fields[i].name = names[i]
          @fields[i].update!
        <~ Promise.all promises .then
        #@fields = [[k,v] for k,v of @data.0].map(-> {name: it.0, type: \String})
        #for item in @fields => data-service.field.settype @data, item
        @size = angular.toJson(@data).length
        @rows = @data.length
        #if @key => for item in @fields => item.dataset = @key
        */
    service.Field = Field
    dataService = baseService.derive name, service, Dataset
    dataService.sample = sampleData.map -> new Dataset it
    dataService

  ..controller \dataEditCtrl,
  <[$scope $timeout $http dataService eventBus plNotify]> ++
  ($scope, $timeout, $http, data-service, eventBus, plNotify) ->
    $scope <<< do
      rawdata: ""
      dataset: null
      worker: new Worker("/js/data/worker.js")
      loading: true
      inited: false
    $scope.name = null
    $scope.save = (locally = false) ->
      if !$scope.dataset or !$scope.dataset.name => return
      if !$scope.user.authed! => return $scope.auth.toggle true
      column-length = [k for k of $scope.parse.{}result].length
      if column-length >= 40 =>
        return plNotify.send \danger, "maximal 40 columns is allowed. you have #{column-length}"
      <- $scope.parse.run true .then
      $scope.dataset._type.location = (if locally => \local else \server)
      $scope.dataset.set-fields $scope.parse.result
      is-create = if !$scope.dataset.key => true else false
      $scope.loading = true
      $scope.dataset.save!
        .then (r) ->
          $scope.$apply -> plNotify.send \success, "dataset saved"
          if is-create =>
            if $scope.$parent and $scope.$parent.inline-create =>
              $scope.$parent.inline-create $scope.dataset
            else
              setTimeout (->
                window.location.href = data-service.link $scope.dataset
              ), 1000
          else => $scope.loading = false
          eventBus.fire \dataset.saved, $scope.dataset
        .catch (e) ->
          console.log e.stack
          $scope.loading = false
          $scope.$apply -> plNotify.aux.error.io \save, \data, e
    $scope.load = (_type, key) ->
      $scope.rawdata = ""
      data-service.load _type, key
        .then (ret) ~>
          $scope.dataset = new data-service.dataset ret
          $scope.parse.revert $scope.dataset
          $scope.inited = true
        .catch (ret) ~>
          console.error ret
          plNotify.send \error, "failed to load dataset. please try reloading"
          #TODO check at server time?
          if ret.1 == \forbidden => window.location.href = \/403.html #window.location.pathname
          $scope.inited = true
    $scope.delete = (dataset) ->
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
        $scope.worker.onmessage = ({data: payload}) ->
          if typeof(payload) != \object => return
          switch payload.type
          | "parse.revert" =>
            $scope.rawdata = payload.data
            $scope.loading = false
      reset: (rawdata) ->
        dataset = new dataService.dataset(window.dataset or {})
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
        else $scope.inited = true
        $scope.$watch 'rawdata', -> $scope.parse.run!
        offset = $('#dataset-editbox textarea').offset!
        $('#dataset-editbox textarea').css({height: "#{window.innerHeight - offset.top - 140}px"})
        #TODO quick hack. think about a better way to do this
        $('.float-dataedit textarea').css({height: "#{window.innerHeight - offset.top - 240}px"})
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
          @ <<< {handle: null, result: {}, size: $scope.rawdata.length}
          Papa.parse ($scope.rawdata or ""), do
            worker: true, header: true
            step: ({data: rows}) ~> for row in rows => for k,v of row => @result[][k].push v
            complete: ~>
              values = [v for k,v of @result] or []
              <~ $scope.$apply
              @ <<< {fields: values.length, rows: (values.0 or []).length}
              $scope.loading = false
              if @rows > 0 and !$scope.dataset.name => $('#dataset-editbox-meta .input-group input').tooltip('show')
              res @result
        if @handle => $timeout.cancel @handle
        if force => return _!
        else @handle = $timeout (~> _! ), (if force => 0 else 1000)

    $scope.parser = do
      encoding: \UTF-8
      csv: do
        toggle: -> setTimeout((->$(\#data-edit-csv-modal).modal \show),0)
        read: ->
          file = $(\#data-edit-csv-file).0.files.0
          reader = new FileReader!
          reader.onload = (e) ->
            $scope.$apply -> $scope.reset e.target.result.trim!
            $(\#data-edit-csv-modal).modal \hide
          reader.onerror = (e) ->
          reader.readAsText(file, $scope.parser.encoding)

      gsheet: do
        url: null
        toggle: -> setTimeout((->$(\#data-edit-gsheet-modal).modal(\show)),0)
        read: ->
          ret = /\/d\/([^\/]+)/.exec($scope.parser.gsheet.url)
          if !ret => return
          key = ret.1
          url = "https://spreadsheets.google.com/feeds/list/#key/1/public/values?alt=json"
          $http url: url, method: \GET
          .success (data) ->
            fields = {}
            data.feed.entry.map (it) ->
              for key of it => if /^gsx\$(.+)$/.exec(key) => fields[that.1] = 1
            fields = [k for k of fields]
            lines = [fields.join(\,)] ++ data.feed.entry.map((it) ->
              [(it["gsx$#key"] or {$t:""}).$t for key in fields].join(\,)
            )
            $scope.$apply -> $scope.reset lines.join(\\n)
            setTimeout((->$(\#data-edit-gsheet-modal).modal(\hide)),0)
          #TODO error handling

      link: do
        url: null
        toggle: -> setTimeout((->$(\#dataset-edit-link-modal).modal(\show)),0)
        read: ->
          $http url: "http://crossorigin.me/#{$scope.parser.link.url}", method: \GET
          .success (d) ->
            $scope.$apply -> $scope.reset d.trim!
            $(\#dataset-edit-link-modal).modal \hide
          #TODO error handling
    eventBus.listen \dataset.delete, (key) -> if $scope.dataset.key == key => $scope.dataset = null
    eventBus.listen \dataset.edit, (dataset, load = true) ->
      #TODO: support more type ( currently CSV structure only )
      $scope.inited = false
      if load and dataset._type.location == \server =>
        $scope.load dataset._type, dataset.key
      else
        $scope.dataset = new data-service.dataset dataset
        $scope.parse.revert $scope.dataset
        $scope.inited = true

    $scope.init!

  ..controller \dataFiles,
  <[$scope dataService plNotify eventBus]> ++
  ($scope, data-service, plNotify, eventBus) ->
    $scope.datasets = data-service.datasets
    (ret) <- data-service.list!then
    $scope.datasets = ret
    $scope.edit = (dataset) -> eventBus.fire \dataset.edit, dataset

    # separate dataset and key otherwise ng-show and euqality comparison will be slow when dataset is large
    $scope.chosen = do
      dataset: null
      key: null
    $scope.toggle = (dataset) ->
      if !dataset or @chosen.key == dataset.key =>
        return @chosen <<< {dataset: null, key: null}
      @chosen.key = dataset.key
      @chosen.dataset = dataset
    $scope.delete = (dataset) ->
      dataset.delete!then ~> $scope.$apply ~> $scope.datasets = $scope.datasets.filter(->it.key != dataset.key)

  ..controller \userDatasetList,
  <[$scope $http dataService]> ++
  ($scope, $http, data-service) ->
    owner = if /^\/user\/([^/]+)/.exec(window.location.pathname) => that.1
    else => (if $scope.user.data => $scope.user.data.key else null)
    $scope.q = {owner}
    if $scope.user.data and owner == $scope.user.data.key => $scope.showPub = true

  ..controller \datasetList,
  <[$scope IOService dataService Paging plNotify eventBus]> ++
  ($scope, IOService, data-service, Paging, plNotify, eventBus) ->
    $scope.paging = Paging
    #$scope.filter = { search: "" }
    $scope.datasets = []
    $scope.mydatasets = []
    $scope.samplesets = dataService.sample.map -> it <<< {key: -Math.random!}

    $scope.q = {}
    $scope.q-lazy = { keyword: null }
    if $scope.$parent.q => $scope.q <<< $scope.$parent.q

    $scope.$watch 'qLazy', (-> $scope.load-list 1000, true), true

    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \dataset}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        data = (ret or []).map -> new dataService.dataset it, true
        Paging.flex-width data
        $scope.mydatasets = (if reset => [] else $scope.mydatasets) ++ data
        $scope.datasets = $scope.mydatasets ++ $scope.samplesets
        $scope.setcur $scope.datasets[0]

    # separate dataset and key otherwise ng-show and euqality comparison will be slow when dataset is large
    $scope.chosen = do
      dataset: null
      key: null
    $scope.toggle = (dataset) ->
      if !dataset or @chosen.key == dataset.key =>
        return @chosen <<< {dataset: null, key: null}
      @chosen.key = dataset.key
      @chosen.dataset = dataset
    $scope.delete = (dataset) ->
      dataset.delete!
        .then ~>
          <~ $scope.$apply
          $scope.datasets = $scope.datasets.filter(->it.key != dataset.key)
          plNotify.send \success, "dataset deleted."
        .catch ~>
          plNotify.send \danger, "failed to delete dataset."
    $scope.inline-create = (it) ->
      data-service.load it._type, it.key
        .then (ret) ~>
          ds = new data-service.dataset ret
          $scope.datasets.splice 0, 0, ds
        .catch (ret) ~>
          console.error ret
          plNotify.send \error, "failed to load dataset. please try reloading"
          #TODO check at server time?
          if ret.1 == \forbidden => window.location.href = \/403.html #window.location.pathname
    $scope.cur = null
    $scope.setcur = -> $scope.cur = it
    if document.querySelectorAll(".ds-list").0 => $scope.limitscroll that
    eventBus.listen \dataset.saved, (dataset = {}) ->
      matched = $scope.datasets.filter(->it.key == dataset.key)[0]
      if matched => matched <<< dataset
    if $(\#list-end) => Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end), $(".ds-list")
    $scope.load-list!

    dsfilter = document.querySelector '#dataset-filter .items'
    if dsfilter =>
      box = dsfilter.getBoundingClientRect!
      dsfilter.style.height = "#{window.innerHeight - box.top - 50}px"
      $scope.jump-to = (dataset) ->
        $scope.scrollto $("\#dataset-#{dataset.key}")

    #experimental functionality
    $scope.transpose = (dataset) ->
      dataset.fields.map -> it.update!
      setTimeout (->
        head = dataset.fields.0
        fields = head.data.map -> new dataService.Field {location: \sample}
        for i from 1 til dataset.fields.length
          for j from 0 til head.data.length
            fields[j].[]data[i - 1] = dataset.fields[i].data[j]
            fields[j].name = head.data[j]
        index = new dataService.Field {location: \sample}
        index.data = dataset.fields.map -> it.name
        index.data.splice 0,1
        index.name = \欄位
        fields = [index] ++ fields
        $scope.$apply -> dataset.fields = fields
      ), 1000
