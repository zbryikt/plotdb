angular.module \plotDB
  ..service \entityService,
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
    select2-config.chart = {} <<< select2-config.base <<< do
      placeholder: "search by chart name or id ..."
      templateResult: ->
        if !it or !it.key => return "<img src='/assets/img/loading.gif'>"
        """
        <div class="select2-chart">
        <div class="avatar" style="background-image:url(/s/chart/#{it.key}.png)"></div>
        <span>#{it.name}</span>
        <small class="grayed">(chart)</small>
        </div>
        """
      templateSelection: ->
        """
        <div class="select2-chart selected">
        <div class="avatar xs" style="background-image:url(/s/chart/#{it.key}.png)"></div>
        <span>#{it.name}</span>
        <small class="grayed">(chart)</small>
        </div>
        """
    select2-config.chart.ajax = {} <<< select2-config.ajax <<< url: "http://localhost/d/chart/?simple=true"
    select2-config.entity = {} <<< select2-config.base <<< do
      placeholder: "search by user, team name or email address..."
    select2-config.entity.ajax = {} <<< select2-config.ajax <<< url: "http://localhost/d/entity/"
    select2-config.entity.ajax.processResults = (data,params) ->
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

    service.{}config.select2 = select2-config
    service
