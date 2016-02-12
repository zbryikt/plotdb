angular.module \plotDB

  ..filter \size, -> ->
    if !it or isNaN(it) => return \0B
    if it < 1000 => "#{it}B"
    else if it < 1048576 => "#{parseInt(it / 102.4)/10}KB"
    else "#{parseInt(it / 104857.6)/10}MB"
  ..service \plUtil, <[$rootScope]> ++ ($rootScope) ->
    ret = do
      format: do
        size: ->
          if it < 1000 => "#{it}bytes"
          else if it < 1048576 => "#{parseInt(it / 102.4)/10}KB"
          else "#{parseInt(it / 104857.6)/10}MB"

  ..service \dataService,
  <[$rootScope $http IOService sampleData baseService plUtil plNotify eventBus]> ++
  ($rootScope, $http, IOService, sampleData, baseService, plUtil, plNotify, eventBus) ->
    name = \dataset
    service = do
      sample: sampleData
      init: -> 
        @list!then ~> @localinfo.update!
      localinfo: do
        rows: 0
        size: 0
        update: ->
          @ <<< {rows: 0, size: 0}
          for item in service.items => if item.type.location == \local => 
            @rows += item.rows
            @size += item.size
    # we can construct directly from a json(field), or from a dataset
    Field = (name, dataset = null, field = null) -> 
      if !field and dataset => field = dataset.fields.filter(->it.name == name).0
      if field => @ <<< field
      # use _ as a little trick to prevent things to be stringify
      @ <<< {name, _: ->}
      if dataset => 
        @ <<< {dataset: {type:dataset.type, key: dataset.key}}
        @_.dataset = dataset
      @
    Field.prototype = do
      dataset: type: {}, key: null, ref: null
      name: null, type: null
      #toJson: -> angular.toJson(@{name, type} <<< {dataset: @dataset{type, key}})
      #TODO this might be called individually. should propagate to dataset?
      update: ->
        (dataset) <~ @get-dataset!then
        @data = dataset.[]data.map(~>it[@name])
        @settype!
      get-dataset: ->
        if @_.dataset => return Promise.resolve(that)
        if !@dataset.type or !dataset.key => return Promise.reject(null)
        (ret) <~ dataService.load @dataset.type, @dataset.key .then
        @dataset <<< {ref: ret} <<< ret{type, key}
        @dataset.ref
      settype: ->
        types = <[Boolean Percent Number Date String]> ++ [null]
        for type in types =>
          if !type => return @type = \String
          if !@data.map(-> plotdb[type]test it).filter(->!it).length => 
            @type = type
            break

    #TODO: Dataset: save: update field dataset type and key
    Dataset = ->
      @fields = [new Field(f.name, @, f) for f in @fields or []]
      @save = ->
        @fields.map(->delete it.data)
        <~ Dataset.prototype.save.call(@).then
        @fields.map ~> it.dataset <<< @{type,key}
        @update!
      @load = ->
        <~ Dataset.prototype.load.call(@).then
        Dataset.call @
      @

    Dataset.prototype = do
      bind: (field) -> #TODO connect dataset and standalone field
      update: (data = null) ->
        if data => @data = data
        if !@data => @data = []
        #TODO support more type
        # CSV dataset use first row as field name
        names = [k for k of @data.0]
        for i from 0 til names.length
          if @fields[i] => that else @fields.push new Field(names[i], @)
          @fields[i].name = names[i]
          @fields[i].update!

        #@fields = [[k,v] for k,v of @data.0].map(-> {name: it.0, type: \String})
        #for item in @fields => data-service.field.settype @data, item
        @size = angular.toJson(@data).length
        @rows = @data.length
        #if @key => for item in @fields => item.dataset = @key
    dataService = baseService.derive name, service, Dataset
    dataService

  ..controller \dataEditCtrl,
  <[$scope $timeout $http dataService plUtil eventBus]> ++
  ($scope, $timeout, $http, data-service, plUtil, eventBus) ->
    $scope.name = null
    $scope.dataset = null
    $scope.save = (locally = false) ->
      $scope.data.parse true
      if !$scope.dataset =>
        config = do
          name: $scope.name
          type: location: (if locally => \local else \server), name: \dataset
          owner: null
          permission: switch: <[public]>, value: []
          datatype: \csv #TODO support more types
        $scope.dataset = new dataService.dataset config
      $scope.dataset.name = $scope.name
      $scope.dataset.update $scope.data.parsed
      $scope.dataset.save!
    $scope.load-dataset = (dataset) ->
      $scope.dataset = dataset
      $scope.name = dataset.name
      fields = dataset.fields.map -> it.name
      $scope.data.raw = ([fields.join(",")] ++ dataset.data.map((obj)->fields.map(->obj[it]).join(\,))).join(\\n)

    $scope.data = do
      init: -> $scope.$watch 'data.raw', (->$scope.data.parse!)
      reset: (data = "") ->
        $scope.dataset = null
        $scope.data.raw = data
      raw: ""
      rows: 0
      size: 0
      parsed: null
      parse: (force = false) ->
        _ = ~>
          if !force => @handler = null
          @parsed = Papa.parse(@raw, {header:true}).data
          @rows = @parsed.length
          @size = @raw.length
        if force => return _!
        if @handler => $timeout.cancel @handler
        @handler = $timeout (~> _! ), (if force => 0 else 1000)
    $scope.data.init!
    $scope.parser = do
      encoding: \UTF-8
      csv: do
        toggle: -> setTimeout((->$(\#data-edit-csv-modal).modal \show),0)
        read: ->
          file = $(\#data-edit-csv-file).0.files.0
          reader = new FileReader!
          reader.onload = (e) ->
            $scope.$apply -> $scope.data.reset e.target.result.trim!
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
            $scope.$apply -> $scope.data.reset lines.join(\\n)
            setTimeout((->$(\#data-edit-gsheet-modal).modal(\hide)),0)
          #TODO error handling

      link: do
        url: null
        toggle: -> setTimeout((->$(\#data-edit-link-modal).modal(\show)),0)
        read: ->
          $http url: "http://crossorigin.me/#{$scope.parser.link.url}", method: \GET
          .success (d) ->
            $scope.$apply -> $scope.data.reset d.trim!
            $(\#data-edit-link-modal).modal \hide
          #TODO error handling
    eventBus.listen \dataset.delete, (key) -> if $scope.dataset.key == key => $scope.dataset = null
    eventBus.listen \dataset.edit, (dataset) -> 
      #TODO: support more type ( currently CSV structure only )
      $scope.load-dataset dataset

  ..controller \dataFiles,
  <[$scope dataService plNotify eventBus]> ++
  ($scope, data-service, plNotify, eventBus) ->
    $scope.datasets = data-service.datasets
    (ret) <- data-service.list!then
    $scope.datasets = ret
    $scope.edit = (dataset) -> eventBus.fire \dataset.edit, dataset
    $scope.remove = (dataset) -> 
      dataset.delete!then ~> $scope.$apply ~> $scope.datasets = $scope.datasets.filter(->it.key != dataset.key)
