// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('pldev', ['$scope', '$http', '$timeout', '$interval', '$sce'].concat(function($scope, $http, $timeout, $interval, $sce){
  $scope.blah = {
    value: 1,
    change: function(){}
  };
  return $timeout(function(){
    $scope.blah.size.toggle('lg');
    $scope.blah.update('123qw');
    return console.log($scope.blah.size.value);
  }, 1000);
}));