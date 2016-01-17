angular.module \plotDB

  ..service \sampleData, <[$rootScope]> ++ ($rootScope) ->
    [
      { 
        name: \Population2015.csv, size: \456KB, rows: \72, color: \#f99, key: 1
        fields: [
          * name: \population, type: \Number, file: 1
          * name: \date, type: \Date, file: 1
        ]
      },
      { 
        name: \Agriculture.csv, size: \73KB, rows: \15, color: \#9f9, key: 2
        fields: [
          * name: \ratio, type: \Percent, file: 2
          * name: \area, type: \Number, file: 2
          * name: \revenue, type: \Number, file: 2
        ]
      },
    ]

  ..service \plUtil, <[$rootScope]> ++ ($rootScope) ->
    ret = do
      format: do
        size: ->
          if it < 1000 => "#{it}bytes"
          else if it < 1048576 => "#{parseInt(it / 102.4)/10}KB"
          else "#{parseInt(it / 104857.6)/10}MB"

  ..service \dataService, <[$rootScope sampleData plUtil]> ++ ($rootScope, sampleData, plUtil) ->
    Dataset = (config) ->
      @ <<< config
      @size = plUtil.format.size angular.toJson(config.data).length
      @rows = config.data.length

    Dataset.prototype = do
      id: 0, name: null, owner: null, size: 0, rows: 0
      type: {}, fields: {}
      permission: {switch: [], list: []}

      save: -> @id = ret.save @
      clone: ->
      delete: ->
      update: ->

    ret = do
      Dataset: Dataset
      datasets: [] ++ sampleData
      name: -> "/datasets/#it"
      local: do
        rows: 0
        size: 0
      init: ->
        @local.rows = 0
        @local.size = 0
        try
          list = JSON.parse(localStorage.getItem("/list/datasets") or null) or []
          for item in list =>
            data = JSON.parse(localStorage.getItem(item) or null)
            if data => 
              @local.rows += data.rows
              @local.size += data.size
              @datasets.push data
          @local.sizetext = @verbose-size @local.size
        catch
          console.log e.toString!
      /*find: (field) ->
        file = @datasets.filter(-> it.key == field.file ).0
        if !file => return null
        field = file.fields.filter(->it.name == field.name).0
        return field*/

      find: (id) -> null
      gen-id: (dataset) -> # TODO: preserve id once generated
        for i from 0 til 1000
          id = "/dataset/#{dataset.type.name}/#{Math.random!toString(36)substring 2}"
          if !@find(id) => return id
        null

      save: (dataset) ->
        if !dataset.id and dataset.type.name == \local => dataset.id = @gen-id dataset
        #TODO save to server, check for name collision
        if !dataset.id => return console.log "failed to gen id"
        idx = @datasets.map(->it.id).indexOf(dataset.id)
        if idx >= 0 => @datasets.splice idx, 1
        if dataset.type.name == \local =>
          localStorage.setItem dataset.id, angular.toJson(dataset)
          list = JSON.parse(localStorage.getItem("/list/datasets") or null) or []
          if list.indexOf(dataset.id) < 0 => list.push dataset.id
          localStorage.setItem("/list/datasets", angular.toJson(list))
        @datasets.push dataset
        return dataset.id

      delete: (dataset) ->
        idx = @datasets.map(->it.id).indexOf(dataset.id) 
        if idx < 0 => return
        @datasets.splice idx, 1
        list = JSON.parse(localStorage.getItem(\/list/datasets))
        if !list => return
        idx = list.indexOf dataset.id
        if idx < 0 => return
        list.splice idx, 1
        localStorage.setItem \/list/datasets, JSON.stringify(list)
        localStorage.setItem(dataset.id, null)
      verbose-size: (size) ->
    ret.init!
    ret
  ..controller \dataEditCtrl,
  <[$scope $timeout $http dataService plUtil]> ++ ($scope, $timeout, $http, data-service, plUtil) ->
    $scope.name = null
    $scope.dataset = null #TODO preload dataset for editing feature
    $scope.save = (locally = false) ->
      config = do
        name: $scope.name
        type: name: \local
        owner: null
        permission: switch: <[public]>, list: []
        data: $scope.data.parsed
        fields: [[k,v] for k,v of $scope.data.parsed.0].map(-> {name: it.0, type: \String})
      $scope.dataset = new dataService.Dataset config
      $scope.dataset.save!

    $scope.data = do
      init: -> $scope.$watch 'data.raw', (->$scope.data.parse!)
      raw: ""
      rows: 0
      size: 0
      parsed: null
      parse: ->
        if @handler => $timeout.cancel @handler
        @handler = $timeout (~>
          @handler = null
          @parsed = Papa.parse(@raw, {header:true}).data
          @rows = @parsed.length
          @size = plUtil.format.size @raw.length
        ), 1000
    $scope.data.init!
    $scope.parser = do
      encoding: \UTF-8
      csv: do
        toggle: -> setTimeout((->$(\#data-edit-csv-modal).modal \show),0)
        read: ->
          file = $(\#data-edit-csv-file).0.files.0
          reader = new FileReader!
          reader.onload = (e) ->
            $scope.$apply -> $scope.data.raw = e.target.result.trim!
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
            $scope.data.raw = lines.join(\\n)
            setTimeout((->$(\#data-edit-gsheet-modal).modal(\hide)),0)
          #TODO error handling

      link: do
        url: null
        toggle: -> setTimeout((->$(\#data-edit-link-modal).modal(\show)),0)
        read: ->
          $http url: "http://crossorigin.me/#{$scope.parser.link.url}", method: \GET
          .success (d) ->
            $scope.data.raw = d.trim!
            $(\#data-edit-link-modal).modal \hide
          #TODO error handling

    /*$scope.editor = do
      raw: ""
      handler: null
      data: null
      parse: ->
        $scope.handler = null
        @data = Papa.parse($scope.editor.raw, {header:true}).data
        @rows = @data.length
        @size = @raw.length
        @sizetext = data-service.verbose-size @size

      build: (is-local)-> do
        name: @name, size: @size, rows: @rows, color: \#ccc, key: $scope.datasets.length,
        data: @data, is-local: is-local,
        fields: [[k,v] for k,v of @data.0].map(-> {name: it.0, type: \String, file: $scope.datasets.length})
      save: (is-local = true) ->
        payload = @build is-local
        data-service.save payload, is-local

    */

    /*$scope.$watch 'editor.raw', -> 
      $scope.editor.data = null
      if $scope.handler => $timeout.cancel $scope.handler
      $scope.handler = $timeout((-> $scope.editor.parse!), 1000)
    $scope.datasets = data-service.datasets*/

  ..controller \dataEditor, <[$scope $timeout $http dataService]> ++ ($scope, $timeout, $http, data-service) ->
  ..controller \dataFiles, <[$scope dataService]> ++ ($scope, data-service) ->
    $scope.datasets = data-service.datasets
    $scope.removedata = (file) -> data-service.delete file
