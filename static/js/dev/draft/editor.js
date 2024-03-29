// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plEditorNew', ['$scope', '$http', '$timeout', '$interval', '$sce', 'plConfig', 'IOService', 'dataService', 'chartService', 'paletteService', 'themeService', 'plNotify', 'eventBus', 'permService', 'license'].concat(function($scope, $http, $timeout, $interval, $sce, plConfig, IOService, dataService, chartService, paletteService, themeService, plNotify, eventBus, permService, license){
  var dispatcher;
  $scope.local = {
    get: function(){
      var this$ = this;
      return new Promise(function(res, rej){
        this$.promise = {
          res: res,
          rej: rej
        };
        return sendMsg({
          type: 'get-local'
        });
      });
    }
  };
  $scope._save = function(){
    var parentKey, ref$, refresh, k, data, this$ = this;
    if (this.save.pending) {
      return;
    }
    this.save.pending = true;
    if (!$scope.writable && $scope.chart.owner !== $scope.user.data.key) {
      parentKey = this.target()._type.location === 'server' ? this.target().key : null;
      ref$ = $scope.target;
      ref$.key = null;
      ref$.owner = null;
      ref$.inherit = [];
      if (!$scope.chart.permission) {
        $scope.chart.permission = {
          'switch': 'publish',
          list: []
        };
      }
      if (parentKey) {
        $scope.chart.parent = parentKey;
      }
    }
    refresh = !$scope.chart.key ? true : false;
    if ($scope.chart.dimension) {
      $scope.chart.dimlen = (function(){
        var results$ = [];
        for (k in $scope.chart.dimension || {}) {
          results$.push(k);
        }
        return results$;
      }()).length;
    }
    data = null;
    return this.local.get().then(function(local){
      this$.chart.local = local;
      data = this$.chart.data;
      this$.chart.data = null;
      return new chartService.chart(this$.chart).save();
    })['finally'](function(){
      this$.save.pending = false;
      return eventBus.fire('loading.dimmer.off');
    }).then(function(ret){
      this$.chart.data = data;
      return this$.$apply(function(){
        plNotify.send('success', "saved");
        if (refresh) {
          return window.location.href = this$.service.link(this$.chart);
        }
      });
    })['catch'](function(err){
      return this$.$apply(function(){
        if (err[2] === 402) {
          eventBus.fire('quota.widget.on');
          return plNotify.send('danger', "Failed: Quota exceeded");
        } else {
          plNotify.aux.error.io('save', this$.type, err);
          return console.error("[save " + name + "]", err);
        }
      });
    });
  };
  $scope.bind = function(dimension, dataset){
    var k, v;
    (function(){
      var ref$, results$ = [];
      for (k in ref$ = dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).map(function(it){
      return it.fieldName = [], it.fields = [], it;
    });
    dataset.fields.map(function(f){
      if (f.bind) {
        return dimension[f.bind].fields.push(f);
      }
    });
    return (function(){
      var ref$, results$ = [];
      for (k in ref$ = dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).map(function(it){
      return it.fieldName = it.fields.map(function(it){
        return it.name;
      });
    });
  };
  $scope.save = function(){
    var promise;
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    if (this.save.pending) {
      return;
    }
    promise = !$scope.chart.name || !$scope.chart.key
      ? $scope.panel.chartName.prompt()
      : Promise.resolve();
    return promise.then(function(){
      $scope.$apply(function(){
        return eventBus.fire('loading.dimmer.on');
      });
      return $scope.dataset.save();
    }).then(function(dataset){
      $scope.bind($scope.chart.dimension, dataset);
      return sendMsg({
        type: 'save'
      });
    })['catch'](function(it){
      return console.log(it);
    });
  };
  $scope.dataset = {
    promise: null,
    save: function(){
      var this$ = this;
      return new Promise(function(res, rej){
        this$.promise = {
          res: res,
          rej: rej
        };
        return eventBus.fire('dataset.save', $scope.chart.name);
      });
    }
  };
  eventBus.listen('dataset.saved', function(ret){
    var that;
    if (that = $scope.dataset.promise.res) {
      return that(ret);
    }
  });
  $scope.sharePanel = {
    embed: {
      width: '100%',
      height: '600px',
      widthRate: 4,
      heightRate: 3
    },
    init: function(){
      var this$ = this;
      $scope.$watch('chart.key', function(){
        if ($scope.chart) {
          return this$.link = $scope.service.sharelink($scope.chart);
        }
      });
      return ['#edit-sharelink-btn', '#edit-sharelink', '#edit-embedcode-btn', '#edit-embedcode'].map(function(eventsrc){
        var clipboard, embedcodeGenerator;
        clipboard = new Clipboard(eventsrc);
        clipboard.on('success', function(){
          $(eventsrc).tooltip({
            title: 'copied',
            trigger: 'click'
          }).tooltip('show');
          return setTimeout(function(){
            return $(eventsrc).tooltip('hide');
          }, 1000);
        });
        clipboard.on('error', function(){
          $(eventsrc).tooltip({
            title: 'Press Ctrl+C to Copy',
            trigger: 'click'
          }).tooltip('show');
          return setTimeout(function(){
            return $(eventsrc).tooltip('hide');
          }, 1000);
        });
        embedcodeGenerator = function(){
          var link, ref$, w, h, wr, hr, ratio;
          link = this$.link;
          ref$ = [this$.embed.width, this$.embed.height], w = ref$[0], h = ref$[1];
          ref$ = [this$.embed.widthRate, this$.embed.heightRate], wr = ref$[0], hr = ref$[1];
          ratio = (hr / (wr || hr || 1)) * 100;
          if (/^\d+$/.exec(w)) {
            w = w + 'px';
          }
          if (/^\d+$/.exec(h)) {
            h = h + 'px';
          }
          if ($scope.sharePanel.aspectRatio) {
            return ["<div style=\"width:100%\"><div style=\"position:relative;height:0;overflow:hidden;", "padding-bottom:" + ratio + "%\"><iframe src=\"" + link + "\" frameborder=\"0\" allowfullscreen=\"true\" ", "style=\"position:absolute;top:0;left:0;width:100%;height:100%\"></iframe></div></div>"].join("");
          } else {
            return ["<iframe src=\"" + link + "\" width=\"" + w + "\" height=\"" + h + "\" ", "allowfullscreen=\"true\" frameborder=\"0\"></iframe>"].join("");
          }
        };
        $scope.$watch('sharePanel.embed', function(){
          return this$.embedcode = embedcodeGenerator();
        }, true);
        $scope.$watch('sharePanel.aspectRatio', function(){
          return this$.embedcode = embedcodeGenerator();
        });
        return $scope.$watch('sharePanel.link', function(){
          return this$.embedcode = embedcodeGenerator();
        });
      });
    }
  };
  $scope.sharePanel.init();
  $scope.updateData = function(data){
    var k, v, i$, to$, i, ref$, ref1$, key$;
    (function(){
      var ref$, results$ = [];
      for (k in ref$ = $scope.dimension) {
        v = ref$[k];
        results$.push(v);
      }
      return results$;
    }()).map(function(it){
      return it.fields = [];
    });
    for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
      i = i$;
      if (!data[i].bind || !$scope.dimension[data[i].bind]) {
        continue;
      }
      ((ref$ = (ref1$ = $scope.dimension)[key$ = data[i].bind] || (ref1$[key$] = {})).fields || (ref$.fields = [])).push(data[i]);
    }
    return sendMsg({
      type: 'update-data',
      data: $scope.dimension
    });
  };
  eventBus.listen('dataset.changed', function(data){
    $scope.updateData(data);
    return $scope.data = data;
  });
  $scope.loadSampleData = function(){
    return sendMsg({
      type: 'get-sample-data'
    });
  };
  dispatcher = function(evt){
    var payload, res, ref$, count, datasetKey, k, v, data, bind;
    payload = evt.data;
    if (evt.data.type === 'local-data') {
      $scope.local.data = payload.data;
      res = ((ref$ = $scope.local).promise || (ref$.promise = {})).res;
      $scope.local.promise = null;
      if (res) {
        res(payload.data);
      }
    }
    if (payload.type === 'save') {
      if (payload.payload) {
        $scope.chart.thumbnail = payload.data;
      }
      $scope._save();
    }
    if (payload.type === 'sample-data') {
      count = 0;
      datasetKey = 0;
      (function(){
        var ref$, results$ = [];
        for (k in ref$ = $scope.chart.dimension) {
          v = ref$[k];
          results$.push([k, v]);
        }
        return results$;
      }()).map(function(){
        var that;
        if (that = (v.fields[0] || {}).dataset) {
          datasetKey = that;
        }
        return count = count + v.fields.length;
      });
      if (!count) {
        $scope.data = data = payload.data;
        eventBus.fire('dataset.update.fields', data, $scope.dimkeys);
        return $scope.updateData(data);
      } else {
        bind = {};
        (function(){
          var ref$, results$ = [];
          for (k in ref$ = $scope.chart.dimension) {
            v = ref$[k];
            results$.push([k, v]);
          }
          return results$;
        }()).map(function(d){
          return d[1].fields.map(function(it){
            return bind[it.key] = d[0];
          });
        });
        return eventBus.fire('dataset.load', datasetKey, $scope.dimkeys, bind);
      }
    }
  };
  import$($scope, {
    settingPanel: {
      tab: 'publish',
      init: function(){
        var this$ = this;
        $scope.permtype = (window.permtype || (window.permtype = []))[1] || 'none';
        $scope.writable = permService.isEnough($scope.permtype, 'write');
        $scope.isAdmin = permService.isEnough($scope.permtype, 'admin');
        $scope.$watch('settingPanel.chart', function(cur, old){
          var k, v, results$ = [];
          for (k in cur) {
            v = cur[k];
            if (!v && !old[k]) {
              continue;
            }
            results$.push($scope.chart[k] = v);
          }
          return results$;
        }, true);
        $scope.$watch('chart.inherit', function(it){
          return this$.chart.inherit = it;
        }, true);
        $scope.$watch('chart.basetype', function(it){
          return this$.chart.basetype = it;
        });
        $scope.$watch('chart.visualencoding', function(it){
          return this$.chart.visualencoding = it;
        });
        $scope.$watch('chart.category', function(it){
          return this$.chart.category = it;
        });
        $scope.$watch('chart.tags', function(it){
          return this$.chart.tags = it;
        });
        return $scope.$watch('chart.library', function(it){
          return this$.chart.library = it;
        });
      },
      toggle: function(tab){
        if (tab) {
          this.tab = tab;
        }
        return this.toggled = !this.toggled;
      },
      toggled: false,
      chart: {
        basetype: null,
        visualencoding: null,
        category: null,
        tags: null,
        library: null,
        inherit: null
      }
    }
  });
  $scope.paledit = {
    convert: function(it){
      return it.map(function(it){
        return {
          id: it.key || Math.random() + "",
          text: it.name,
          data: it.colors
        };
      });
    },
    ldcp: null,
    item: null,
    paste: null,
    init: function(){
      var x$, this$ = this;
      this.ldcp = new ldColorPicker(null, {}, $('#palette-editor .editor .ldColorPicker')[0]);
      this.ldcp.on('change-palette', function(){
        return setTimeout(function(){
          return $scope.$apply(function(){
            return this$.update();
          });
        }, 0);
      });
      this.sample = paletteService.sample;
      this.list = [];
      x$ = $('#pal-select');
      x$.select2({
        ajax: {
          url: '/d/palette',
          dataType: 'json',
          delay: 250,
          data: function(params){
            return {
              offset: (params.page || 0) * 20,
              limit: 20
            };
          },
          processResults: function(data, params){
            params.page = params.page || 0;
            if (params.page === 0) {
              this$.list = data = this$.sample.concat(data);
            } else {
              this$.list = this$.list.concat(data);
            }
            return {
              results: data.map(function(it){
                return {
                  id: it.key,
                  text: it.name,
                  data: it.colors
                };
              }),
              pagination: {
                more: data.length >= 20
              }
            };
          }
        },
        allowedMethods: ['updateResults'],
        escapeMarkup: function(it){
          return it;
        },
        minimumInputLength: 0,
        templateSelection: function(it){
          return it.text + "<small class='grayed'> (" + it.id + ")</small>";
        },
        templateResult: function(state){
          var color, c;
          if (!state.data) {
            return state.text;
          }
          color = (function(){
            var i$, ref$, len$, results$ = [];
            for (i$ = 0, len$ = (ref$ = state.data).length; i$ < len$; ++i$) {
              c = ref$[i$];
              results$.push("<div class='color' " + ("style='background:" + c.hex + ";width:" + 100 / state.data.length + "%'") + "></div>");
            }
            return results$;
          }()).join("");
          $(("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>"));
          return ("<div class='palette select'><div class='name'>" + state.text + "</div>") + ("<div class='palette-color'>" + color + "</div></div>");
        }
      });
      x$.on('select2:closing', function(e){
        var key, ret;
        key = $(e.target).val();
        ret = this$.list.filter(function(it){
          return it.key == key;
        })[0];
        $scope.$apply(function(){
          return this$.item.value = JSON.parse(JSON.stringify(ret));
        });
        return this$.ldcp.setPalette(this$.item.value);
      });
      return $scope.$watch('paledit.paste', function(d){
        var result, e;
        try {
          result = JSON.parse(d);
          if (Array.isArray(result)) {
            return this$.ldcp.setPalette({
              colors: result.map(function(it){
                return {
                  hex: it
                };
              })
            });
          }
        } catch (e$) {
          e = e$;
          console.log(e);
          return $scope.paledit.paste = '';
        }
      });
    },
    update: function(){
      var ref$, src, des, pairing, i$, to$, i, d, j$, to1$, j, s, len$, pair, unpair;
      if (this.item) {
        ref$ = [this.item.value, this.ldcp.getPalette(), []], src = ref$[0], des = ref$[1], pairing = ref$[2];
        for (i$ = 0, to$ = des.colors.length; i$ < to$; ++i$) {
          i = i$;
          d = des.colors[i];
          for (j$ = 0, to1$ = src.colors.length; j$ < to1$; ++j$) {
            j = j$;
            s = src.colors[j];
            if (s.hex !== d.hex) {
              continue;
            }
            pairing.push([s, d, Math.abs(i - j)]);
          }
        }
        pairing.sort(function(a, b){
          return a[2] - b[2];
        });
        for (i$ = 0, len$ = pairing.length; i$ < len$; ++i$) {
          pair = pairing[i$];
          if (pair[0].pair || pair[1].pair) {
            continue;
          }
          pair[0].pair = pair[1];
          pair[1].pair = pair[0];
        }
        unpair = [
          src.colors.filter(function(it){
            return !it.pair;
          }), des.colors.filter(function(it){
            return !it.pair;
          })
        ];
        for (i$ = 0, to$ = Math.min(unpair[0].length, unpair[1].length); i$ < to$; ++i$) {
          i = i$;
          unpair[1][i].pair = unpair[0][i];
        }
        src.colors = des.colors.map(function(it){
          var ref$;
          if (it.pair) {
            return ref$ = it.pair, ref$.hex = it.hex, ref$;
          } else {
            return it;
          }
        });
        src.colors.forEach(function(it){
          var ref$;
          return ref$ = it.pair, delete it.pair, ref$;
        });
        this.paste = null;
        return $scope.updateConfig($scope.chart.config);
      }
    },
    toggled: false,
    toggle: function(){
      this.toggled = !this.toggled;
      if (!this.toggled) {
        return this.update();
      }
    },
    edit: function(item){
      this.item = item;
      this.ldcp.setPalette(item.value);
      return this.toggled = true;
    }
  };
  $scope.paledit.init();
  return $scope.coloredit = {
    idx: 0,
    config: function(v){
      return {
        'class': "no-palette text-input top",
        context: "context-" + (this.idx++),
        exclusive: true,
        palette: [v.value]
      };
    }
  };
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}