angular.module \plotDB
  ..controller \test, <[$scope IOService]> ++ ($scope, IOService) ->
    $scope.io = IOService

