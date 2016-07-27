angular.module \plotDB
  ..controller \userSelection, <[$scope $http plNotify teamService]> ++ ($scope,$http,plNotify,teamService) ->
    console.log \123
    $scope.save = ->
      members = $(\#search-user).val!
      team = new teamService.team!
      team <<< $scope{name, description}
      $http do
        url: \/d/team/
        method: \POST
        data: {team: team, members: members}
      .success (d) ->
        plNotify.send \success, "team created."
      .error (d) ->
        plNotify.send \error, "failed creating team. try again later?"

    $(\#search-user-team).select2 do
       ajax: do
         url: "http://localhost/d/user/?team=true"
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
             results: data.map(->it <<< {id: "#{it.type}:#{it.key}"})
             pagination: { more: data and data.length }
         cache: true
       escapeMarkup: -> it
       minimumInputLength: 1
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

    $(\#search-user).select2 do
       ajax: do
         url: "http://localhost/d/user/"
         dataType: "json"
         delay: 250
         data: (params) ->
           params.num = parseInt(Math.random!*100)
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
       escapeMarkup: -> it
       minimumInputLength: 1
       templateResult: ->
         if !it or !it.displayname => return "<img src='/assets/img/loading.gif'>"
         """
         <div class="select2-user">
         <img src="/s/avatar/#{it.avatar or 0}.jpg">
         <span>#{it.displayname}</span>
         </div>
         """
       templateSelection: ->
         """
         <div class="select2-user selected">
         <img src="/s/avatar/#{it.avatar or 0}.jpg">
         <span>#{it.displayname}</span>
         </div>
         """

