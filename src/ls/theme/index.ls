angular.module \plotDB
  ..service \sampleTheme, <[$rootScope]> ++ ($rootScope) ->
    plotdb.theme.sample
  ..service \themeService,
  <[$rootScope $http IOService sampleTheme baseService plUtil plNotify eventBus]> ++
  ($rootScope, $http, IOService, sampleTheme, baseService, plUtil, plNotify, eventBus) ->
    service = do
      sample: sampleTheme
    Theme = -> @
    themeService = baseService.derive \theme, service, Theme
    themeService
