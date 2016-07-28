angular.module \plotDB
  ..service \teamService,
  <[$rootScope $http plConfig IOService baseService]> ++
  ($rootScope, $http, plConfig, IOService, baseService) ->
    service = {}
    select2-config = do
      base: do
        escapeMarkup: -> it
        language: do
          inputTooShort: ->
             "<span class='grayed'>type #{it.minimum - (it.input or '').length} more chars to search</span>"
          errorLoading: -> "<span class='grayed'>something is wrong... try again later.</span>"
          loadingMore: -> "<img src='/assets/img/loading.gif'>"
          noResults: -> "<span class='grayed'>no result.</span>"
          searching: -> "<img src='/assets/img/loading.gif'><span class='grayed'>searching...</span>"
        minimumInputLength: 3
        templateResult: ->
          if !it or !it.displayname => return "<img src='/assets/img/loading.gif'>"
          """
          <div class="select2-user">
          <img src="/s/avatar/#{it.avatar or 0}.jpg">
          <span>#{it.displayname}</span>
          <small class="grayed">#{if it.type=="team" => "(team)" else ""}</small>
          </div>
          """
        templateSelection: ->
          """
          <div class="select2-user selected">
          <img src="/s/avatar/#{it.avatar or 0}.jpg">
          <span>#{it.displayname}</span>
          <small class="grayed">#{if it.type=="team" => "(team)" else ""}</small>
          </div>
          """
      ajax: do
        dataType: "json"
        delay: 250
        data: (params) ->
          return do
            keyword: params.term
            offset: (params.page or 0) * 20
            limit: 20
        processResults: (data,params) ->
          params.page = params.page or 0
          return do
            results: data.map(->it <<< {id: it.key})
            pagination: { more: data and data.length }
        cache: true

    select2-config.entity = {} <<< select2-config.base <<< do
      placeholder: "search by user, team name or email address..."
    select2-config.entity.ajax = {} <<< select2-config.ajax <<< url: "http://localhost/d/entity/"
    select2-config.entity.ajax.processResults = (data,params) ->
      processResults: (data,params) ->
        params.page = params.page or 0
        return do
          results: data.map(->it <<< {id: "#{it.type}:#{it.key}"})
          pagination: { more: data and data.length }

    select2-config.team = {} <<< select2-config.base <<< do
      placeholder: "search by team name or email address..."
    select2-config.team.ajax = {} <<< select2-config.ajax <<< url: "http://localhost/d/team/"

    select2-config.user = {} <<< select2-config.base <<< do
      placeholder: "search by user name or email address..."
    select2-config.user.ajax = {} <<< select2-config.ajax <<< url: "http://localhost/d/user/"

    object = ->
      @ <<< do
        name: \untitled
        description: null
        owner: null, createdtime: new Date!, modifiedtime: new Date!
        _type: {location: \server, name: \team}
        permission: { switch: [], value: []}
      @
    teamService = baseService.derive \team ,service, object
    teamService.{}config.select2 = select2-config
    teamService
  ..controller \teamEdit,
  <[$scope $http plNotify teamService eventBus]> ++
  ($scope, $http, plNotify, teamService, eventBus) ->
    $scope.team = new teamService.team!
    $scope.members = []

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
          $scope.avatar.upload $scope.team
            .then ->
              $scope.$apply ->
                eventBus.fire 'loading.dimmer.off'
                plNotify.send \success, "team #{if is-update => \updated else \created}."
            .catch (err) ->
              $scope.$apply ->
                eventBus.fire 'loading.dimmer.off'
                plNotify.send \warning, "team created, but... "
                plNotify.send \danger, err
        else
          plNotify.send \success, "team created."
          eventBus.fire 'loading.dimmer.off'
      .error (d) ->
        eventBus.fire 'loading.dimmer.off'
        plNotify.send \error, "failed creating team. try again later?"
