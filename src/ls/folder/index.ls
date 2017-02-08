angular.module \plotDB
  ..service \folderService,
  <[$rootScope $http IOService baseService plNotify eventBus plConfig]> ++
  ($rootScope, $http, IOService, baseService, plNotify, eventBus, plConfig) ->
    service = {}
    object = ->
    folderService = baseService.derive \folder ,service, object
    folderService

  ..controller \folderList,
  <[$scope $http IOService folderService Paging plNotify eventBus]> ++
  ($scope, $http, IOService, folder-service, Paging, plNotify, eventBus) ->
    $scope.loading = true
    $scope.folders = []
    $scope.q = {}
    $scope.q-lazy = { keyword: null }
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \folder}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        data = (ret or []).map -> new folderService.folder it, true
        Paging.flex-width data
        $scope.folders = (if reset => [] else $scope.folders) ++ data

    $scope.$watch 'q', (-> $scope.load-list 500, true), true
    $scope.$watch 'qLazy', (-> $scope.load-list 1000, true), true
    Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
    
    $scope.open = (folder) ->
      folder = new folderService.folder({key: folder.key or folder})
      console.log folder
      folder.load!
        .then (folder) -> $scope.$apply -> $scope.active-folder = folder
        .catch -> console.log \erro

    $scope.delete = (key) ->
      folder = new folderService.folder({key: key})
      folder.delete!
        .then -> console.log \ok
        .catch -> console.log \err

    $scope.delfrom = (folder, item, type) ->
      $http do
        url: "/d/folder/#folder/content/del"
        method: "POST"
        data: {item, type}
      .success (d) ->
        plNotify.send \success, "removed"
      .error (d) ->
        if d == \non-existed => plNotify.send \error, "not in folder"
        else plNotify.send \error, "failed to move from folder. try later?"

    $scope.addto = (folder, item, type) ->
      $http do
        url: "/d/folder/#folder/content"
        method: "POST"
        data: {item, type}
      .success (d) ->
        plNotify.send \success, "added"
      .error (d) ->
        if d == \existed => plNotify.send \error, "already in folder"
        else plNotify.send \error, "failed to move to folder. try later?"
      
    $scope.active = -> $scope.folder = it
    $scope.edit = toggled: false, toggle: -> @toggled = if !(it?) => !!!@toggled else it
    $scope.rename = -> 
      if $scope.folder =>
        $scope.folder.save!
          .then -> plNotify.send \success, "saved"
          .catch -> plNotify.send \success, "save failed. try later?"
    $scope.create-form = do
      name: "unnamed folder"
      permission: {switch: \publish, list: []}
      create: ->
        console.log 1
        folder = new folderService.folder(
          {} <<< $scope.create-form{permission, name} <<< {key: null, owner: null}
        )
        console.log 2
        folder.save!
          .then ->
            console.log 3
            console.log \ok
          .catch -> console.log \err
