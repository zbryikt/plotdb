angular.module \plotDB
  ..service \paletteService,
  <[$rootScope samplePalette IOService baseService]> ++
  ($rootScope, samplePalette, IOService, baseService) ->
    service = do
      sample: samplePalette
      list2pal: (name, list) -> {name, colors: list.map(-> hex: it)}

    object = -> @
    paletteService = baseService.derive name, service, object
    paletteService
