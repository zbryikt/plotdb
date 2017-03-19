angular.module \plotDB
  ..controller \plEditorNew,
  <[$scope $http $timeout $interval $sce plConfig IOService dataService chartService paletteService themeService plNotify eventBus permService license]> ++ ($scope,$http,$timeout,$interval,$sce,plConfig,IOService,data-service,chart-service,paletteService,themeService,plNotify,eventBus,permService,license) ->
    plotdb.load 1008, (chart) ->
      chart.config do
        yAxisShowDomain: false
      chart.attach '#editor-canvas .inner'
