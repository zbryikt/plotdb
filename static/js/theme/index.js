// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('sampleTheme', ['$rootScope'].concat(function($rootScope){
  return plotdb.theme.sample;
}));
x$.service('themeService', ['$rootScope', '$http', 'IOService', 'sampleTheme', 'baseService', 'plNotify', 'eventBus'].concat(function($rootScope, $http, IOService, sampleTheme, baseService, plNotify, eventBus){
  var service, object, themeService;
  service = {
    sample: sampleTheme,
    link: function(theme){
      return "/theme/?k=" + theme._type.location.charAt(0) + theme.key;
    },
    thumblink: function(theme){
      return "/theme/thumb/?k=" + theme._type.location.charAt(0) + theme.key;
    },
    sharelink: function(theme){
      return "https://plotdb.com" + this.link(theme);
    }
  };
  object = function(src){
    var ref$;
    import$(this, {
      name: 'untitled',
      description: null,
      tags: null,
      theme: null,
      doc: {
        name: 'document',
        type: 'html',
        content: ((ref$ = service.sample[0]).doc || (ref$.doc = {})).content || ""
      },
      style: {
        name: 'stylesheet',
        type: 'css',
        content: ((ref$ = service.sample[0]).style || (ref$.style = {})).content || ""
      },
      code: {
        name: 'code',
        type: 'javascript',
        content: ((ref$ = service.sample[0]).code || (ref$.code = {})).content || ""
      },
      config: {},
      dimension: {},
      assets: [],
      likes: 0,
      parent: null
    });
    import$(this, src);
    if (!Array.isArray(this.assets)) {
      this.assets = [];
    }
    return this;
  };
  object.prototype = {
    addFile: function(name, type, content){
      var file;
      content == null && (content = null);
      file = {
        name: name,
        type: type,
        content: content
      };
      this.assets.push(file);
      return file;
    },
    removeFile: function(file){
      var idx;
      idx = this.assets.indexOf(file);
      if (idx < 0) {
        return;
      }
      return this.assets.splice(idx, 1);
    }
  };
  themeService = baseService.derive('theme', service, object);
  return themeService;
}));
x$.controller('themeList', ['$scope', '$http', 'IOService', 'dataService', 'themeService'].concat(function($scope, $http, IOService, dataService, themeService){
  $scope.themes = [];
  return Promise.all([
    new Promise(function(res, rej){
      return IOService.aux.listLocally({
        name: 'theme'
      }, res, rej);
    }), new Promise(function(res, rej){
      return IOService.aux.listRemotely({
        name: 'theme'
      }, res, rej, "q=all");
    })
  ]).then(function(ret){
    var this$ = this;
    return $scope.$apply(function(){
      $scope.themes = ret[0].concat(ret[1]);
      $scope.themes.forEach(function(it){
        return it.width = Math.random() > 0.8 ? 640 : 320;
      });
      return $scope.load = function(theme){
        return window.location.href = themeService.link(theme);
      };
    });
  });
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}