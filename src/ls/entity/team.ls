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

  ..controller \teamChooser,
  <[$scope $http folderService plNotify eventBus]> ++
  ($scope, $http, folder-service, plNotify, eventBus) ->
    $scope.show = false
    $scope.target = null
    $scope.mteam = []
    $scope.add = ->
      if !$scope.[]mteam[0] or !$scope.mteam[0].key or !$scope.{}target.key =>
        $scope.hint = true
        return
      eventBus.fire \loading.dimmer.on
      $http do
        url: "/d/team/#{$scope.mteam[0].key}/chart/"
        method: \post
        data: [$scope.{}target.key]
      .success (d) ->
        eventBus.fire \loading.dimmer.off
        $scope.show = false
        plNotify.send \success, "added"
      .error (d) ->
        eventBus.fire \loading.dimmer.off
        if d == \existed =>
          $scope.show = false
          plNotify.send \warning, "already in this collection"
        else
          plNotify.send \error, "failed to add; try later?"

    eventBus.listen \add-to-team, (item) ->
      $scope.target = item
      $scope.show = true

  ..controller \teamEdit,
  <[$scope $http $timeout plNotify teamService chartService eventBus]> ++
  ($scope, $http, $timeout, plNotify, teamService, chartService, eventBus) ->
    $scope.team = new teamService.team(window.team or {})
    $scope.members = window.members or []
    $scope.newMembers = []
    $scope.charts = window.charts or []
    $scope.newCharts = []
    $scope.teamtab = \chart
    $scope.link = do
      chart: -> chart-service.link it

    $scope.new-chart = (tid) ->
      eventBus.fire 'loading.dimmer.on'
      chart = new chart-service.chart {}, true
      chart.save {team: tid}
        .then (data) ->
          <- $scope.$apply
          plNotify.send \success, "chart created"
          $scope.charts = [chart] ++ $scope.charts
          $timeout (->
            window.location.href = $scope.link.chart(chart)
          ), 1000
        .catch (e) -> $scope.$apply ->
          console.log e
          eventBus.fire 'loading.dimmer.off'
          plNotify.send \danger, e.1

    $scope.remove-chart = (tid, cid) ->
      $http do
        url: "/d/team/#tid/chart/#cid"
        method: \DELETE
      .success (d) ->
        idx = $scope.charts.map(->it.key).indexOf(cid)
        if idx < 0 => return
        $scope.charts.splice idx, 1
        plNotify.send \success, "chart removed"
      .error (d) ->
        plNotify.send \error, "failed to remove chart, try again later?"

    $scope.remove-member = (tid, owner, mid) ->
      if mid == owner =>
        plNotify.send \error, "can't remove owner"
        return
      $http do
        url: "/d/team/#tid/member/#mid"
        method: \DELETE
      .success (d) ->
        idx = $scope.members.map(->it.key).indexOf(mid)
        if idx < 0 => return
        $scope.members.splice idx, 1
        plNotify.send \success, "member removed"
      .error (d) ->
        plNotify.send \error, "failed to remove member, try again later?"

    $scope.add-charts = (tid) ->
      if !$scope.user.data => return plNotify.send \error, "permission denied"
      if !$scope.newCharts or !$scope.newCharts.length => return
      keys = $scope.newCharts.filter(->it.owner == $scope.user.data.key).map -> it.key
      ckeys = $scope.charts.map -> it.key
      keys = keys.filter -> ckeys.indexOf(it) < 0
      if keys.length < $scope.newCharts.length =>
        plNotify.send \warning, "some charts are already in this team"
      if keys.length == 0 => return
      $http do
        url: "/d/team/#tid/chart/"
        method: \post
        data: $scope.newCharts.filter(->it.owner == $scope.user.data.key).map -> it.key
      .success (d) ->
        $scope.charts ++= $scope.newCharts.filter(->ckeys.indexOf(it.key)<0)
        $scope.newCharts.splice 0
        plNotify.send \success, "charts added"
      .error (d) ->
        plNotify.send \error, "failed to add charts. try again later?"

    $scope.add-members = (tid) ->
      if !$scope.newMembers or !$scope.newMembers.length => return
      ckey = $scope.members.map -> it.key
      nkey = $scope.newMembers.map -> it.key
      nkey = nkey.filter -> ckey.indexOf(it)<0
      if nkey.length < $scope.newMembers.length =>
        plNotify.send \warning, "some users are already in this team"
      if nkey.length == 0 => return
      $http do
        url: "/d/team/#tid/member/"
        method: \POST
        data: nkey
      .success (d) ->
        $scope.members ++= $scope.newMembers.filter(->ckey.indexOf(it.key)<0)
        $scope.newMembers.splice 0
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
        data: if is-update => $scope.team else {team: $scope.team, members: $scope.newMembers.map(->it.key)}
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
              plNotify.send \warning, "team #{if is-update => \updated else \created}, but... "
              plNotify.send \danger, err
              $scope.redirect 2000
      .error (d) ->
        eventBus.fire 'loading.dimmer.off'
        plNotify.send \error, "failed #{if is-update => \updating else \creating} team. try again later?"
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
