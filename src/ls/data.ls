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

  ..service \dataService, <[$rootScope sampleData]> ++ ($rootScope, sampleData) ->
    ret = do
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
            data = JSON.parse(localStorage.getItem(@name(item)) or null)
            if data => 
              @local.rows += data.rows
              @local.size += data.size
              @datasets.push data
          @local.sizetext = @verbose-size @local.size
        catch
          console.log e.toString!
      find: (field) ->
        file = @datasets.filter(-> it.key == field.file ).0
        if !file => return null
        field = file.fields.filter(->it.name == field.name).0
        return field

      save: (data, is-local=true) ->
        #TODO save to server, check for name collision
        idx = @datasets.map(->it.name).indexOf(data.name)
        if idx >= 0 => @datasets.splice idx, 1
        if is-local =>
          localStorage.setItem @name(data.name), JSON.stringify(data)
          list = JSON.parse(localStorage.getItem("/list/datasets") or null) or []
          if list.indexOf(data.name) < 0 => list.push data.name
          localStorage.setItem("/list/datasets", JSON.stringify(list))
        @datasets.push data
      delete: (data) ->
        idx = @datasets.indexOf(data) 
        if idx < 0 => return
        @datasets.splice idx, 1
        list = JSON.parse(localStorage.getItem(\/list/datasets))
        if !list => return
        idx = list.indexOf data.name
        if idx < 0 => return
        list.splice idx, 1
        localStorage.setItem \/list/datasets, JSON.stringify(list)
        localStorage.setItem(@name(data.name), null)
      verbose-size: (size) ->
        if size < 1000 => "#{size}bytes"
        else if size < 1048576 => "#{parseInt(size / 102.4)/10}KB"
        else "#{parseInt(size / 104857.6)/10}MB"
    ret.init!
    ret
  ..controller \dataCreateCtrl, <[$scope $timeout $http dataService]> ++ ($scope, $timeout, $http, data-service) ->
    $scope.editor = do
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

    $scope.$watch 'editor.raw', -> 
      $scope.editor.data = null
      if $scope.handler => $timeout.cancel $scope.handler
      $scope.handler = $timeout((-> $scope.editor.parse!), 1000)
    $scope.datasets = data-service.datasets

    $scope.CSVEncoding = "UTF-8"
    $scope.uploadFromCSV = -> setTimeout((->$(\#fromCSVModal).modal \show),0)
    $scope.readCSV = ->
      file = $(\#CSVFile).0.files.0
      reader = new FileReader!
      reader.onload = (e) ->
        $scope.$apply -> $scope.editor.raw = e.target.result.trim!
        $(\#fromCSVModal).modal \hide
      reader.onerror = (e) ->
      reader.readAsText(file, $scope.CSVEncoding)

    $scope.uploadFromLink = -> setTimeout((->$(\#fromLinkModal).modal(\show)),0)
    $scope.readLink = ->
      $http do
        url: "http://crossorigin.me/#{$scope.linkURL}"
        method: \GET
      .success (d) ->
        $scope.editor.raw = d.trim!
        $(\#fromLinkModal).modal \hide

    $scope.uploadFromSpreadsheet = -> setTimeout((->$(\#fromSpreadsheetModal).modal(\show)),0)
    $scope.readSpreadsheet = ->
      ret = /\/d\/([^\/]+)/.exec($scope.spreadsheetURL)
      if !ret => return
      key = ret.1
      cb = (data) ->
        result = data.map((d) -> d.map((it) -> \" +(it.replace(/[\r\n]/,"") or " ")+\").join(\,)).join \\n
        $scope.text = result
        $(\#fromSpreadsheetModal).modal(\hide")
      console.log "https://spreadsheets.google.com/feeds/list/#key/1/public/values?alt=json"
      $http do
        url: "https://spreadsheets.google.com/feeds/list/#key/1/public/values?alt=json"
        method:\GET
      .success (data) ->
        fields = {}
        data.feed.entry.map (it) ->
          for key of it => if /^gsx\$(.+)$/.exec(key) => fields[that.1] = 1
        fields = [k for k of fields]
        lines = [fields.join(\,)] ++ data.feed.entry.map((it) ->
          [(it["gsx$#key"] or {$t:""}).$t for key in fields].join(\,)
        )
        $scope.editor.raw = lines.join(\\n)
        setTimeout((->$(\#fromSpreadsheetModal).modal(\hide)),0)
      .error -> cb []
  ..controller \dataEditor, <[$scope $timeout $http dataService]> ++ ($scope, $timeout, $http, data-service) ->
  ..controller \dataFiles, <[$scope dataService]> ++ ($scope, data-service) ->
    $scope.datasets = data-service.datasets
    $scope.removedata = (file) -> data-service.delete file
