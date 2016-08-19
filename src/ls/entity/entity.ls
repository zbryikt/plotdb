angular.module \plotDB
  ..service \entityService,
  <[$rootScope $http plConfig IOService baseService]> ++
  ($rootScope, $http, plConfig, IOService, baseService) ->
    service = do
      config: plselect: do
        chart: do
          placeholder: "search by chart name or id ..."
          ajax: do
            url: \/d/entity/?type=4
            param: (keyword, limit, offset) -> {simple: true, keyword, limit, offset}
        entity-chart: do
          placeholder: "search by user, chart, team name or email address..."
          ajax: do
            url: \/d/entity/?type=7
            param: (keyword, limit, offset) -> {keyword, limit, offset}
        entity: do
          placeholder: "search by user, team name or email address..."
          ajax: do
            url: \/d/entity/
            param: (keyword, limit, offset) -> {keyword, limit, offset}
        team: do
          placeholder: "search by team name or email address..."
          ajax: do
            url: \/d/team/
            param: (keyword, limit, offset) -> {keyword, limit, offset}
        user: do
          placeholder: "search by user name or email address..."
          ajax: do
            url: \/d/user/
            param: (keyword, limit, offset) -> {keyword, limit, offset}

    service
