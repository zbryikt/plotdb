// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('paletteService', ['$rootScope', 'samplePalette', 'IOService', 'baseService'].concat(function($rootScope, samplePalette, IOService, baseService){
  var name, service, Palette, paletteService;
  name = 'palette';
  service = {
    sample: samplePalette,
    list2pal: function(name, list){
      return {
        name: name,
        colors: list.map(function(it){
          return {
            hex: it
          };
        })
      };
    },
    list: function(){
      return IOService.listRemotely({
        name: 'palette',
        location: 'server'
      }).then(function(r){
        return r.map(function(it){
          return new Dataset(it);
        });
      });
    }
  };
  Palette = function(config){
    import$(this, {
      name: "",
      colors: [],
      owner: null,
      createdtime: new Date(),
      modifiedtime: new Date(),
      permission: {
        'switch': [],
        value: []
      },
      _type: {
        location: 'server',
        name: 'palette'
      }
    });
    import$(this, config);
    return this;
  };
  paletteService = baseService.derive(name, service, Palette);
  return paletteService;
}));
x$.controller('paletteList', ['$scope', 'IOService', 'paletteService', 'Paging', 'plNotify', 'eventBus'].concat(function($scope, IOService, paletteService, Paging, plNotify, eventBus){
  $scope.paging = Paging;
  $scope.samplesets = paletteService.sample.map(function(it){
    return it.key = -Math.random(), it;
  });
  $scope.palettes = [].concat($scope.samplesets);
  $scope.myPalettes = [];
  $scope.setcur = function(it){
    return $scope.cur = it;
  };
  $scope.loadList = function(delay, reset){
    delay == null && (delay = 1000);
    reset == null && (reset = false);
    return Paging.load(function(){
      var payload, ref$;
      payload = import$(import$((ref$ = {}, ref$.offset = Paging.offset, ref$.limit = Paging.limit, ref$), $scope.q), $scope.qLazy);
      return IOService.listRemotely({
        name: 'palette'
      }, payload);
    }, delay, reset).then(function(ret){
      var this$ = this;
      return $scope.$apply(function(){
        var data;
        data = (ret || []).map(function(it){
          return new paletteService.palette(it);
        });
        $scope.myPalettes = (reset
          ? []
          : $scope.myPalettes).concat(data);
        $scope.palettes = $scope.samplesets.concat($scope.myPalettes);
        if (!$scope.cur) {
          return $scope.setcur($scope.palettes[0]);
        }
      });
    });
  };
  $scope.$watch('palettes', function(){
    var i$, to$, i, pal, results$ = [];
    for (i$ = 0, to$ = $scope.palettes.length; i$ < to$; ++i$) {
      i = i$;
      pal = $scope.palettes[i];
      results$.push(pal.width = 100 / pal.colors.length);
    }
    return results$;
  });
  if ($('#pal-list-end')) {
    Paging.loadOnScroll(function(){
      return $scope.loadList();
    }, $('#pal-list-end'), $('#pal-editor-loader'));
  }
  $scope.loadList();
  eventBus.listen('paledit.update', function(pal){
    var matched;
    matched = $scope.myPalettes.filter(function(it){
      return it.key === pal.key;
    });
    if (matched.length) {
      return import$(matched[0], pal);
    } else {
      return $scope.loadList();
    }
  });
  return eventBus.listen('paledit.delete', function(key){
    $scope.myPalettes = $scope.myPalettes.filter(function(it){
      return it.key !== key;
    });
    return $scope.palettes = $scope.palettes.filter(function(it){
      return it.key !== key;
    });
  });
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}