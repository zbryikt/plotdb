angular.module \plotDB
  ..service \folderService,
  <[$rootScope $http IOService baseService plNotify eventBus plConfig]> ++
  ($rootScope, $http, IOService, baseService, plNotify, eventBus, plConfig) ->
    service = do
      addto: (folder, item, type) -> new Promise (res, rej) ->
        $http do
          url: "/d/folder/#folder/content"
          method: "POST"
          data: {item, type}
        .success (d) -> res d
        .error (d) -> rej d

    object = ->
    folderService = baseService.derive \folder ,service, object
    folderService

  ..controller \folderEdit,
  <[$scope $http folderService plNotify eventBus]> ++
  ($scope, $http, folder-service, plNotify, eventBus) ->
    $scope.edit = do
      toggled: {}
      toggle: (v, type) ->
        list = if type? => [type] else [k for k of @toggled]
        list.forEach (k) ~> @toggled[k] = if !(v?) => !!!@toggled[k] else v
    $scope.prepare = (folder) ->
      $scope.folder = folder
      $scope.name = if folder and folder.name => that else "unnamed collection"
      $scope.description = if folder and folder.description => that else ""
    eventBus.listen \folder.edit.name, (folder) ->
      $scope.prepare folder
      $scope.edit.toggle true, \name
    eventBus.listen \folder.edit.description, (folder) ->
      $scope.prepare folder
      $scope.edit.toggle true, \description
    $scope.save = ->
      eventBus.fire \loading.dimmer.on
      create = false
      folder = $scope.folder
      if !folder =>
        folder = new folderService.folder do
          permission: {switch: \publish, list: [{"perm": "fork", "type": "global", "target": null, "username": "and anonymous user", "displayname": "Everyone"}]}
          name: $scope.name
          description: $scope.description
          key: null
          owner: null
      else
        folder.name = $scope.name
        folder.description = $scope.description
      folder.save!
        .then(-> $scope.$apply ->
          eventBus.fire \loading.dimmer.off
          plNotify.send \success, "saved"
          $scope.edit.toggle false
          if !$scope.folder => eventBus.fire \folderList.add, folder
        ).catch ->
          plNotify.send \error, "failed.. try later?"
          eventBus.fire \loading.dimmer.off

  ..controller \folderChooser,
  <[$scope $http folderService plNotify eventBus]> ++
  ($scope, $http, folder-service, plNotify, eventBus) ->
    $scope.show = false
    $scope.target = null
    $scope.mfolder = []
    $scope.createAndAdd = (keyword) ->
      if !keyword => return
      eventBus.fire \loading.dimmer.on
      folder = new folderService.folder({name: keyword} <<< {key: null, owner: null})
      folder.save!
        .then((key) -> $scope.$apply ->
          $scope.mfolder = [folder]
          $scope.add!
          eventBus.fire \loading.dimmer.off
        ).catch(-> $scope.$apply ->
          plNotify.send \success, 'cannot create collection. try later?'
          eventBus.fire \loading.dimmer.off
        )

    $scope.add = ->
      fkey = $scope.[]mfolder{}[0].key
      tkey = $scope.{}target.key
      type = $scope.{}target.{}_type.name or $scope.{}target.type
      if !tkey and $scope.{}target.type => tkey = $scope.{}target.item
      if !fkey or !tkey =>
        $scope.hint = true
        return
      eventBus.fire \loading.dimmer.on
      folder-service.addto fkey, tkey, type
        .then(-> $scope.$apply ->
          eventBus.fire \loading.dimmer.off
          $scope.show = false
          plNotify.send \success, "added"
        ).catch (d) -> $scope.$apply ->
          eventBus.fire \loading.dimmer.off
          if d == \existed =>
            $scope.show = false
            plNotify.send \warning, "already in this collection"
          else
            plNotify.send \error, "failed to add; try later?"

    eventBus.listen \folder-chooser-prechoose, (key) ->
      console.log \123

    eventBus.listen \add-to-collection, (item) ->
      ret = /hint\.addCollection\.(\d+)/.exec window.location.hash
      if ret =>
        folder = new folderService.folder({key: ret.1})
        folder.load!then -> $scope.$apply ->
          folder.type = \folder
          folder.displayname = folder.name
          $scope.mfolder.splice 0
          $scope.mfolder.push folder
          $scope.target = item
          $scope.show = true
      else
        $scope.target = item
        $scope.show = true

  ..controller \folderView,
    <[$scope $http IOService folderService Paging plNotify eventBus]> ++
    ($scope, $http, IOService, folder-service, Paging, plNotify, eventBus) ->
      $scope.item = []
      key = /\/collection\/(\d+)\/?/.exec(window.location.href)
      $http do
        url: "/d/folder/#{key.1}"
        method: \GET
      .success (d) ->
        $scope.folder = new folderService.folder d
        $scope.items = d.content
      .error (d) ->
      $scope.rename = -> eventBus.fire \folder.edit.name, $scope.folder
      $scope.open = (item) -> window.location.href = "/chart/#{item.item}"
      $scope.libraryName = -> ($scope.{}folder.name or "unnamed").replace(/ /g, "-")
      $scope.hint = do
        download:
          toggled: false
          toggle: -> @toggled = if it? => it else !!!@toggled
      $scope.remove = (item) -> 
        eventBus.fire \loading.dimmer.on
        $http do
          url: "/d/folder/#{key.1}/content/del"
          method: \POST
          data: {item: item.item, type: item.type}
        .success (d) ->
          plNotify.send \success, "removed."
          eventBus.fire \loading.dimmer.off
          if $scope.items.indexOf(item) >= 0 =>  $scope.items.splice $scope.items.indexOf(item), 1
        .error (d) ->
          plNotify.send \success, "failed to remove. try later?"
          eventBus.fire \loading.dimmer.off

  ..controller \folderList,
  <[$scope $http IOService folderService Paging plNotify eventBus]> ++
  ($scope, $http, IOService, folder-service, Paging, plNotify, eventBus) ->
    $scope.settingPanel = do
      tab: \permission
      init: ->
        $scope.permtype = window.[]permtype.1 or 'none'
      toggle: (tab) ->
        if tab? => @tab = tab
        @toggled = !!!@toggled
      toggled: false
    $scope.paging = Paging
    $scope.loading = true
    $scope.myfolders = []
    $scope.folders = []
    $scope.q = {}
    $scope.q-lazy = { keyword: null }
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        IO-service.list-remotely {name: \folder}, payload
      ), delay, reset).then (ret) -> $scope.$apply ~>
        data = (ret or []).map -> new folderService.folder it, true
        keys = $scope.folders.map -> it.key
        if !reset => data = data.filter(-> keys.indexOf(it.key) < 0)
        Paging.flex-width data
        $scope.folders = (if reset => [] else $scope.folders) ++ data

    $scope.$watch 'q', (-> $scope.load-list 500, true), true
    $scope.$watch 'qLazy', (-> $scope.load-list 1000, true), true
    Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
    
    $scope.goto = (folder) -> window.location.href = "/collection/#{folder.key}"
    $scope.open = (folder) ->
      folder = new folderService.folder({key: folder.key or folder})
      console.log folder
      folder.load!
        .then (folder) -> $scope.$apply -> $scope.active-folder = folder
        .catch -> console.log \erro

    $scope.delete = (folder) ->
      eventBus.fire \loading.dimmer.on
      folder.delete!
        .then(-> $scope.$apply ->
          plNotify.send \success, \deleted
          if $scope.folders.indexOf(folder) >= 0 =>
            $scope.folders.splice($scope.folders.indexOf(folder), 1)
        ).catch(-> $scope.$apply -> plNotify.send \error, 'failed to delete. try later?')
        .finally(-> $scope.$apply -> eventBus.fire \loading.dimmer.off)

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
      folder-service.addto folder, item, type
    $scope.rename = -> if it.owner == $scope.user.data.key => eventBus.fire \folder.edit.name, it
    $scope.create = -> eventBus.fire \folder.edit.name, null
    eventBus.listen \folderList.add, -> $scope.folders = [it] ++ $scope.folders
