// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('userSelection', ['$scope', '$http', 'plNotify', 'teamService'].concat(function($scope, $http, plNotify, teamService){
  var select2BaseConfig;
  select2BaseConfig = {
    escapeMarkup: function(it){
      return it;
    },
    language: {
      inputTooShort: function(it){
        return "<span class='grayed'>type " + (it.minimum - (it.input || '').length) + " more chars to search</span>";
      },
      errorLoading: function(){
        return "<span class='grayed'>something is wrong... try again later.</span>";
      },
      loadingMore: function(){
        return "<img src='/assets/img/loading.gif'>";
      },
      noResults: function(){
        return "<span class='grayed'>no result.</span>";
      },
      searching: function(){
        return "<img src='/assets/img/loading.gif'><span class='grayed'>searching...</span>";
      }
    },
    minimumInputLength: 3,
    templateResult: function(it){
      if (!it || !it.displayname) {
        return "<img src='/assets/img/loading.gif'>";
      }
      return "<div class=\"select2-user\">\n<img src=\"/s/avatar/" + (it.avatar || 0) + ".jpg\">\n<span>" + it.displayname + "</span>\n<small class=\"grayed\">" + (it.type === "team" ? "(team)" : "") + "</small>\n</div>";
    },
    templateSelection: function(it){
      return "<div class=\"select2-user selected\">\n<img src=\"/s/avatar/" + (it.avatar || 0) + ".jpg\">\n<span>" + it.displayname + "</span>\n<small class=\"grayed\">" + (it.type === "team" ? "(team)" : "") + "</small>\n</div>";
    }
  };
  $scope.save = function(){
    var members, team;
    members = $('#search-user').val();
    team = new teamService.team();
    team.name = $scope.name;
    team.description = $scope.description;
    return $http({
      url: '/d/team/',
      method: 'POST',
      data: {
        team: team,
        members: members
      }
    }).success(function(d){
      return plNotify.send('success', "team created.");
    }).error(function(d){
      return plNotify.send('error', "failed creating team. try again later?");
    });
  };
  $('#search-user-team').select2(import$(select2BaseConfig, {
    placeholder: "search by user, team name or email address...",
    ajax: {
      url: "/d/user/?team=true",
      dataType: "json",
      delay: 250,
      data: function(params){
        return {
          keyword: params.term,
          offset: (params.page || 0) * 20,
          limit: 20
        };
      },
      processResults: function(data, params){
        params.page = params.page || 0;
        return {
          results: data.map(function(it){
            return it.id = it.type + ":" + it.key, it;
          }),
          pagination: {
            more: data && data.length
          }
        };
      },
      cache: true
    }
  }));
  /*
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
  */
  return $('#search-user').select2(import$(select2BaseConfig, {
    placeholder: "search by user name or email address...",
    ajax: {
      url: "/d/user/",
      dataType: "json",
      delay: 250,
      data: function(params){
        params.num = parseInt(Math.random() * 100);
        return {
          keyword: params.term,
          offset: (params.page || 0) * 20,
          limit: 20
        };
      },
      processResults: function(data, params){
        params.page = params.page || 0;
        return {
          results: data.map(function(it){
            return it.id = it.key, it;
          }),
          pagination: {
            more: data && data.length
          }
        };
      },
      cache: true
    }
  }));
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}