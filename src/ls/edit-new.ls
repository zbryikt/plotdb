angular.module \plotDB
  ..controller \plEditorNew,
  <[$scope $http $timeout $interval $sce plConfig IOService dataService chartService paletteService themeService plNotify eventBus permService license]> ++ ($scope,$http,$timeout,$interval,$sce,plConfig,IOService,data-service,chart-service,paletteService,themeService,plNotify,eventBus,permService,license) ->
    $scope.$watch 'edfunc', ->
      $timeout (->
        left = Math.max.apply(null, Array.from(document.querySelectorAll '.editor-func-detail')
          .map(->it.getBoundingClientRect!width)) + 100
        node = document.querySelector '#editor-canvas'
        node.style.left = "#{left}px"
        node = document.querySelector '.editor-ctrls'
        node.style.left = "#{left}px"
      ), 0
    $scope.map = []
    plotdb.load 1008, (chart) ->
      chart.config do
        yAxisShowDomain: false
      chart.attach '#editor-canvas .inner'
      dimkeys = [k for k of chart._.chart.dimension] ++ [null]
      data =  plotdb.chart.get-sample-data chart._.chart
      data = data.map (row)->
        for k,v of row =>
          if Array.isArray(v) =>
            delete row[k]
            for i from 0 til v.length => row["#{k}[#{i+1}]"] = v[i]
        row
      eventBus.fire \dataset.sample, data
      eventBus.listen \dataset.changed, (data) ->
        hash = {}
        for item in data =>
          name = item.name.replace /\[.+\]/, ''
          hash[][name].push item
          if !$scope.map.inited => $scope.map.push name
        $scope.map.inited = true
        console.log ">", hash
        dims = document.querySelectorAll '#dataset-editbox .sheet .sheet-dim .dropdown'
        Array.from(dims).map (node, i) ->
          node.querySelector 'span' .innerText = $scope.map[i] or ''
          console.log dimkeys
          node.querySelector 'ul' .innerHTML = dimkeys.map((e,j) ->
            if e == null => "<li><a href='#' class='grayed'><small>(empty)</small></a></li>"
            else "<li><a data-dimname='#e' href='#'>#e</a></li>"
          ).join("")
          node.querySelector 'ul' .addEventListener \click, (e) -> 
            console.log i, $scope.map[i]
            dimname = e.target.getAttribute(\data-dimname)
            $scope.map[i] = dimname or null
            console.log i, $scope.map[i]
            Array.from(dims).map (n, j) ->
              n.querySelector 'span' .setAttribute \class, if $scope.map[j] => "" else  "grayed text-sm"
              n.querySelector 'span' .innerText = $scope.map[j] or '(empty)'
              console.log ">", j, $scope.map[j]
            hash = {}
            for k from 0 til data.length =>
              if !$scope.map[k] => continue
              hash[][$scope.map[k]].push data[k]
            chart.data hash, true

        $('.sheet-dim .dropdown-toggle').dropdown()

        chart.data hash, true
