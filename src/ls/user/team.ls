angular.module \plotDB
  ..service \teamService,
  <[$rootScope $http plConfig IOService baseService]> ++
  ($rootScope, $http, plConfig, IOService, baseService) ->
    service = {}
    object = ->
      @ <<< do
        name: \untitled
        description: null
        owner: null, createdtime: new Date!, modifiedtime: new Date!
        _type: {location: \server, name: \team}
        permission: { switch: [], value: []}
      @
    teamService = baseService.derive \team ,service, object
    teamService
  ..controller \team, <[$scope $http plNotify]> ++ ($scope, $http, plNotify) ->
    $scope.remove-member = (tid, mid) ->
      $http do
        url: "/d/team/#tid/member/#mid"
        method: \DELETE
      .success (d) ->
        plNotify.send \success, "members removed"
      .error (d) ->
        plNotify.send \error, "failed to remove member, try again later?"
    $scope.add-members = (tid) ->
      new-members = $(\#search-user).val!
      $http do
        url: "/d/team/#tid/member/"
        method: \POST
        data: new-members
      .success (d) ->
        plNotify.send \success, "members added"
      .error (d) ->
        plNotify.send \error, "failed to add members. try again later?"
