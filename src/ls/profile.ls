angular.module \plotDB
  ..controller \profile,
  <[$scope dataService chartService themeService]> ++
  ($scope, data-service, chart-service, theme-service) ->
    data-service.list!then (ret) -> $scope.$apply -> $scope.datasets = ret
    theme-service.list!then (ret) -> $scope.$apply -> $scope.themes = ret
