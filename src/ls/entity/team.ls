angular.module \plotDB
  ..service \teamService,
  <[$rootScope $http plConfig IOService baseService]> ++
  ($rootScope, $http, plConfig, IOService, baseService) ->
    service = {}
    object = (config) ->
      @ <<< do
        name: \untitled
        description: null
        owner: null, createdtime: new Date!, modifiedtime: new Date!
        _type: {location: \server, name: \team}
        permission: { switch: [], value: []}
      @ <<< config
      @
    teamService = baseService.derive \team ,service, object
    teamService
  ..controller \teamEdit,
  <[$scope $http $timeout plNotify teamService eventBus]> ++
  ($scope, $http, $timeout, plNotify, teamService, eventBus) ->
    $scope.team = new teamService.team(window.team or {})
    $scope.members = []
    $scope.newMembers = []

    $scope.remove-member = (tid, mid) ->
      $http do
        url: "/d/team/#tid/member/#mid"
        method: \DELETE
      .success (d) ->
        plNotify.send \success, "members removed"
      .error (d) ->
        plNotify.send \error, "failed to remove member, try again later?"

    $scope.add-members = (tid) ->
      if !$scope.newMembers or !$scope.newMembers.length => return
      $http do
        url: "/d/team/#tid/member/"
        method: \POST
        data: $scope.newMembers
      .success (d) ->
        plNotify.send \success, "members added"
      .error (d) ->
        plNotify.send \error, "failed to add members. try again later?"
    $scope.avatar = do
      files: []
      raw: null
      preview: null
      init: -> $scope.$watch 'avatar.files', ~>
        @parse!
          .then (payload) ~>
            $scope.$apply ~>
              @raw = payload
              @preview = null
              if @raw => @preview = URL.createObjectURL new Blob [@raw], {type: @files.0.type}
          .catch (e) ~>
            $scope.$apply ~>
              @preview = null
              plNotify.send \danger, e
      parse: -> new Promise (res, rej) ~>
        file = @files.0
        if !file => res!
        if !(/image\//.exec file.type) => return rej "Avatar is not an image, use image instead."
        if file.size >= 1048576 => return rej "Avatar is too large. let's try another (<1MB)."
        fr = new FileReader!
          ..onabort = -> rej "Failed reading avatar. Try other image?"
          ..onerror = -> rej "Failed reading avatar. Try other image?"
          ..onload = -> res(new Uint8Array fr.result)
          ..read-as-array-buffer file
      upload: (team) -> new Promise (res, rej) ~>
        if !team or !team.key => return rej "Can't upload avatar if there is no team."
        if !@raw => return rej "No avatar to upload. Select a file first!"
        fd = new FormData!
        fd.append \image, new Blob([@raw], {type: "application/octet-stream"})
        $http do
          url: "/d/team/#{team.key}/avatar/"
          method: \POST
          data: fd
          transformRequest: angular.identity
          headers: "Content-Type": undefined
        .success (d) -> res!
        .error (d) -> rej "Failed uploading avatar. Try other image later?"


    $scope.avatar.init!
    $scope.error = {}
    $scope.dismiss = -> eventBus.fire 'team-panel.create.dismiss'
    $scope.redirect = (delay = 0) ->
      if $scope.team and $scope.team.key =>
        setTimeout (->window.location.href = "/team/#{$scope.team.key}"), delay
    $scope.save = ->
      is-update = !!$scope.team.key
      $scope.error = {}
      if !$scope.team.name =>
        $scope.error.name = true
        return plNotify.send \danger, "Team name is required."
      eventBus.fire 'loading.dimmer.on'
      $http do
        url: "/d/team/#{if is-update => $scope.team.key else ''}"
        method: (if is-update => \PUT else \POST)
        data: if is-update => $scope.team else {team: $scope.team, members: $scope.members}
      .success (d) ->
        if !is-update => $scope.team.key = d.key
        if $scope.avatar.files.0 and $scope.avatar.raw =>
          promise = $scope.avatar.upload $scope.team
        else promise = Promise.resolve!
        promise
          .then ->
            $scope.$apply ->
              plNotify.send \success, "team #{if is-update => \updated else \created}."
              if !is-update => $scope.redirect 1000
              else
                $scope.redirect 1000
                $timeout (->
                  eventBus.fire 'loading.dimmer.off'
                  eventBus.fire 'team-panel.create.dismiss'
                ), 1000
          .catch (err) ->
            $scope.$apply ->
              plNotify.send \warning, "team created, but... "
              plNotify.send \danger, err
              $scope.redirect 2000
      .error (d) ->
        eventBus.fire 'loading.dimmer.off'
        plNotify.send \error, "failed creating team. try again later?"
  ..controller \teamList,
  <[$scope IOService teamService Paging plNotify eventBus]> ++
  ($scope, IOService, team-service, Paging, plNotify, eventBus) ->
    $scope.teams = []
    $scope.paging = Paging
    $scope.paging.limit = 50
    $scope.$watch 'qLazy', (-> $scope.load-list 1000, true), true
    $scope.load-list = (delay = 1000, reset = false) ->
      Paging.load((->
        payload = {} <<< Paging{offset,limit} <<< $scope.q <<< $scope.q-lazy
        payload <<< detail: true
        IO-service.list-remotely {name: \team}, payload
      ), delay, reset, 'teams').then (ret) -> $scope.$apply ~>
        data = (ret.teams or []).map -> new teamService.team it
        data.map (t) ->
          t.members = ret.members.filter((m)-> m.team == t.key)
          t.count = +t.count
        Paging.flex-width data
        $scope.teams = (if reset => [] else $scope.teams) ++ data
    if $(\#list-end) => Paging.load-on-scroll (-> $scope.load-list!), $(\#list-end)
    $scope.load-list!
  ..controller \teamBase,
  <[$scope IOService teamService Paging plNotify eventBus]> ++
  ($scope, IOService, team-service, Paging, plNotify, eventBus) ->
    $scope.team-panel = do
      create: do
        toggle: ->
          if !$scope.user.authed! => return $scope.auth.toggle true
          @toggled = !!!@toggled
    eventBus.listen 'team-panel.create.dismiss', -> $scope.team-panel.create.toggled = false
