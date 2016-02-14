angular.module \plotDB
  ..service \paletteService,
  <[$rootScope samplePalette IOService baseService]> ++
  ($rootScope, samplePalette, IOService, baseService) ->
    service = do
      sample: samplePalette

    object = -> @
    paletteService = baseService.derive name, service, object
    paletteService
