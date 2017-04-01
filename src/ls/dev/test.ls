angular.module \plotDB
  ..controller \pldev,
  <[$scope $http $timeout $interval $sce]> ++ ($scope,$http,$timeout,$interval,$sce) ->
    $scope.blah = do
      value: 1
      change: ->
    $timeout (->
      $scope.blah.size.toggle \lg
      $scope.blah.update \123qw
      console.log $scope.blah.size.value
    ), 1000
