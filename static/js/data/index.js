// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.service('dataService', ['$rootScope', '$http', 'IOService', 'sampleData', 'baseService', 'plNotify', 'eventBus'].concat(function($rootScope, $http, IOService, sampleData, baseService, plNotify, eventBus){
  var name, service, Field, Dataset, dataService;
  name = 'dataset';
  service = {
    sample: sampleData,
    list: function(){
      return IOService.listRemotely({
        name: 'dataset',
        location: 'server'
      }).then(function(r){
        return r.map(function(it){
          return new Dataset(it);
        });
      });
    },
    init: function(){},
    localinfo: {
      rows: 0,
      size: 0,
      update: function(){
        var i$, ref$, len$, item, results$ = [];
        this.rows = 0;
        this.size = 0;
        for (i$ = 0, len$ = (ref$ = service.items).length; i$ < len$; ++i$) {
          item = ref$[i$];
          if (item._type.location === 'local') {
            this.rows += item.rows;
            results$.push(this.size += item.size);
          }
        }
        return results$;
      }
    }
  };
  Field = function(config){
    import$(this, config);
    return this;
  };
  Field.prototype = {
    dataset: {
      _type: {},
      key: null
    },
    name: null,
    type: null,
    update: function(){
      var this$ = this;
      return this.getDataset().then(function(dataset){
        if (!dataset) {
          return;
        }
        this$.data = (dataset.data || (dataset.data = [])).map(function(it){
          return it[this$.name];
        });
        return this$.settype();
      });
    },
    setDataset: function(dataset){
      var ref$;
      dataset == null && (dataset = null);
      this._.dataset = dataset;
      if (dataset && dataset._type && dataset.key) {
        (ref$ = this.dataset, ref$._type = dataset._type, ref$.key = dataset.key, ref$).name = dataset.name;
      } else {
        ref$ = this.dataset._type;
        ref$._type = {};
        ref$.key = null;
        ref$.name = null;
      }
      return Promise.resolve(dataset);
    },
    getDataset: function(){
      var that, this$ = this;
      if (that = this._.dataset) {
        return Promise.resolve(that);
      }
      if (!this.dataset._type || !this.dataset.key) {
        return Promise.resolve(null);
      }
      return dataService.load(this.dataset._type, this.dataset.key).then(function(ret){
        var ref$;
        this$._.dataset = ret;
        (ref$ = this$.dataset, ref$._type = ret._type, ref$.key = ret.key, ref$).name = ret.name;
        return this$._.dataset;
      });
    },
    settype: function(){
      var types, i$, len$, type;
      types = ['Boolean', 'Percent', 'Number', 'Date', 'String'].concat([null]);
      for (i$ = 0, len$ = types.length; i$ < len$; ++i$) {
        type = types[i$];
        if (!type) {
          return this.type = 'String';
        }
        if (!this.data.map(fn$).filter(fn1$).length) {
          this.type = type;
          break;
        }
      }
      function fn$(it){
        return plotdb[type].test(it);
      }
      function fn1$(it){
        return !it;
      }
    }
  };
  Dataset = function(config){
    import$(this, {
      name: "",
      description: "",
      type: "static",
      format: "csv",
      owner: null,
      createdtime: new Date(),
      modifiedtime: new Date(),
      permission: {
        'switch': [],
        value: []
      },
      fields: [],
      _type: {
        location: 'server',
        name: 'dataset'
      }
    });
    import$(this, config);
    return this;
  };
  Dataset.prototype = {
    setFields: function(fields){
      var res$, k, ref$, v, i$, len$, f1, j$, len1$, f2, results$ = [];
      fields == null && (fields = null);
      if (fields && typeof fields === 'object') {
        res$ = [];
        for (k in ref$ = fields || []) {
          v = ref$[k];
          res$.push(new Field({
            name: k,
            data: v,
            dataset: this.key,
            datasetname: this.name,
            location: this._type.location
          }));
        }
        fields = res$;
        for (i$ = 0, len$ = (ref$ = this.fields).length; i$ < len$; ++i$) {
          f1 = ref$[i$];
          for (j$ = 0, len1$ = fields.length; j$ < len1$; ++j$) {
            f2 = fields[j$];
            if (f1.name !== f2.name) {
              continue;
            }
            import$(f2, f1);
          }
        }
        this.fields = fields;
        this.rows = ((ref$ = this.fields[0] || {}).data || (ref$.data = [])).length;
        this.size = 0;
        for (i$ = 0, len$ = (ref$ = this.fields).length; i$ < len$; ++i$) {
          f1 = ref$[i$];
          results$.push(this.size += (f1.data || "").length + (f1.name.length + 1));
        }
        return results$;
      }
    },
    update: function(){}
  };
  dataService = baseService.derive(name, service, Dataset);
  return dataService;
}));
x$.controller('dataEditCtrl', ['$scope', '$timeout', '$http', 'dataService', 'eventBus', 'plNotify'].concat(function($scope, $timeout, $http, dataService, eventBus, plNotify){
  import$($scope, {
    rawdata: "",
    dataset: null,
    worker: new Worker("/js/data/worker.js")
  });
  $scope.name = null;
  $scope.save = function(locally){
    var columnLength, k;
    locally == null && (locally = false);
    if (!$scope.dataset || !$scope.dataset.name) {
      return;
    }
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    columnLength = (function(){
      var ref$, results$ = [];
      for (k in (ref$ = $scope.parse).result || (ref$.result = {})) {
        results$.push(k);
      }
      return results$;
    }()).length;
    if (columnLength >= 20) {
      return plNotify.send('danger', "maximal 20 columns is allowed. you have " + columnLength);
    }
    return $scope.parse.run(true).then(function(){
      $scope.dataset._type.location = locally ? 'local' : 'server';
      /*if !$scope.dataset =>
        config = do
          name: $scope.name
          _type: location: (if locally => \local else \server), name: \dataset
          owner: null
          permission: switch: <[public]>, value: []
          datatype: \csv #TODO support more types
        $scope.dataset = new dataService.dataset config
      $scope.dataset.name = $scope.name
      */
      $scope.dataset.setFields($scope.parse.result);
      return $scope.dataset.save().then(function(){
        return $scope.$apply(function(){
          return plNotify.send('success', "dataset saved");
        });
      })['catch'](function(e){
        console.log(e.stack);
        return $scope.$apply(function(){
          return plNotify.aux.error.io('save', 'data', e);
        });
      });
    });
  };
  $scope.load = function(_type, key){
    var this$ = this;
    return dataService.load(_type, key).then(function(ret){
      $scope.dataset = new dataService.dataset(ret);
      return $scope.parse.revert($scope.dataset);
    })['catch'](function(ret){
      console.error(ret);
      plNotify.send('error', "failed to load data. please try reloading");
      if (ret[1] === 'forbidden') {
        return window.location.href = '/403.html';
      }
    });
  };
  $scope.loadDataset = function(dataset){
    var fields;
    $scope.dataset = dataset;
    $scope.name = dataset.name;
    fields = dataset.fields.map(function(it){
      return it.name;
    });
    return $scope.rawdata = ([fields.join(",")].concat(dataset.data.map(function(obj){
      return fields.map(function(it){
        return obj[it];
      }).join(',');
    }))).join('\n');
  };
  import$($scope, {
    communicate: function(){
      return $scope.worker.onmessage = function(arg$){
        var payload;
        payload = arg$.data;
        if (typeof payload !== 'object') {
          return;
        }
        switch (payload.type) {
        case "parse.revert":
          $scope.rawdata = payload.data;
          return $scope.parse.loading = false;
        }
      };
    },
    reset: function(rawdata){
      return $scope.dataset = new dataService.dataset(), $scope.rawdata = rawdata, $scope;
    },
    init: function(){
      var ret, offset;
      this.reset("");
      ret = /k=([sc])([^&?#]+)/.exec(window.location.search || "");
      if (ret) {
        $scope.load({
          location: ret[1] === 's' ? 'server' : 'local',
          name: 'dataset'
        }, ret[2]);
      }
      $scope.$watch('rawdata', function(){
        return $scope.parse.run();
      });
      offset = $('#dataset-editbox textarea').offset();
      $('#dataset-editbox textarea').css({
        height: (window.innerHeight - offset.top - 140) + "px"
      });
      $('[data-toggle="tooltip"]').tooltip();
      return this.communicate();
    }
  });
  $scope.parse = {
    rows: 0,
    fields: 0,
    size: 0,
    result: null,
    loading: false,
    handle: null,
    revert: function(dataset){
      this.loading = true;
      return $scope.worker.postMessage({
        type: "parse.revert",
        data: dataset
      });
    },
    run: function(force){
      var this$ = this;
      force == null && (force = false);
      return new Promise(function(res, rej){
        var _;
        this$.loading = true;
        _ = function(){
          this$.handle = null;
          this$.result = {};
          this$.size = $scope.rawdata.length;
          return Papa.parse($scope.rawdata || "", {
            worker: true,
            header: true,
            step: function(arg$){
              var rows, i$, len$, row, lresult$, k, v, ref$, results$ = [];
              rows = arg$.data;
              for (i$ = 0, len$ = rows.length; i$ < len$; ++i$) {
                row = rows[i$];
                lresult$ = [];
                for (k in row) {
                  v = row[k];
                  lresult$.push(((ref$ = this$.result)[k] || (ref$[k] = [])).push(v));
                }
                results$.push(lresult$);
              }
              return results$;
            },
            complete: function(){
              var values, k, v;
              values = (function(){
                var ref$, results$ = [];
                for (k in ref$ = this.result) {
                  v = ref$[k];
                  results$.push(v);
                }
                return results$;
              }.call(this$)) || [];
              return $scope.$apply(function(){
                this$.loading = false;
                this$.fields = values.length;
                this$.rows = (values[0] || []).length;
                return res(this$.result);
              });
            }
          });
        };
        if (this$.handle) {
          $timeout.cancel(this$.handle);
        }
        if (force) {
          return _();
        } else {
          return this$.handle = $timeout(function(){
            return _();
          }, force ? 0 : 1000);
        }
      });
    }
  };
  $scope.parser = {
    encoding: 'UTF-8',
    csv: {
      toggle: function(){
        return setTimeout(function(){
          return $('#data-edit-csv-modal').modal('show');
        }, 0);
      },
      read: function(){
        var file, reader;
        file = $('#data-edit-csv-file')[0].files[0];
        reader = new FileReader();
        reader.onload = function(e){
          $scope.$apply(function(){
            return $scope.reset(e.target.result.trim());
          });
          return $('#data-edit-csv-modal').modal('hide');
        };
        reader.onerror = function(e){};
        return reader.readAsText(file, $scope.parser.encoding);
      }
    },
    gsheet: {
      url: null,
      toggle: function(){
        return setTimeout(function(){
          return $('#data-edit-gsheet-modal').modal('show');
        }, 0);
      },
      read: function(){
        var ret, key, url;
        ret = /\/d\/([^\/]+)/.exec($scope.parser.gsheet.url);
        if (!ret) {
          return;
        }
        key = ret[1];
        url = "https://spreadsheets.google.com/feeds/list/" + key + "/1/public/values?alt=json";
        return $http({
          url: url,
          method: 'GET'
        }).success(function(data){
          var fields, res$, k, lines;
          fields = {};
          data.feed.entry.map(function(it){
            var key, that, results$ = [];
            for (key in it) {
              if (that = /^gsx\$(.+)$/.exec(key)) {
                results$.push(fields[that[1]] = 1);
              }
            }
            return results$;
          });
          res$ = [];
          for (k in fields) {
            res$.push(k);
          }
          fields = res$;
          lines = [fields.join(',')].concat(data.feed.entry.map(function(it){
            var key;
            return (function(){
              var i$, ref$, len$, results$ = [];
              for (i$ = 0, len$ = (ref$ = fields).length; i$ < len$; ++i$) {
                key = ref$[i$];
                results$.push((it["gsx$" + key] || {
                  $t: ""
                }).$t);
              }
              return results$;
            }()).join(',');
          }));
          $scope.$apply(function(){
            return $scope.reset(lines.join('\n'));
          });
          return setTimeout(function(){
            return $('#data-edit-gsheet-modal').modal('hide');
          }, 0);
        });
      }
    },
    link: {
      url: null,
      toggle: function(){
        return setTimeout(function(){
          return $('#dataset-edit-link-modal').modal('show');
        }, 0);
      },
      read: function(){
        return $http({
          url: "http://crossorigin.me/" + $scope.parser.link.url,
          method: 'GET'
        }).success(function(d){
          $scope.$apply(function(){
            return $scope.reset(d.trim());
          });
          return $('#dataset-edit-link-modal').modal('hide');
        });
      }
    }
  };
  eventBus.listen('dataset.delete', function(key){
    if ($scope.dataset.key === key) {
      return $scope.dataset = null;
    }
  });
  eventBus.listen('dataset.edit', function(dataset){
    console.log(dataset._type, dataset.key);
    return $scope.load(dataset._type, dataset.key);
  });
  return $scope.init();
}));
x$.controller('dataFiles', ['$scope', 'dataService', 'plNotify', 'eventBus'].concat(function($scope, dataService, plNotify, eventBus){
  $scope.datasets = dataService.datasets;
  return dataService.list().then(function(ret){
    $scope.datasets = ret;
    $scope.edit = function(dataset){
      return eventBus.fire('dataset.edit', dataset);
    };
    $scope.chosen = {
      dataset: null,
      key: null
    };
    $scope.toggle = function(dataset){
      var ref$;
      if (!dataset || this.chosen.key === dataset.key) {
        return ref$ = this.chosen, ref$.dataset = null, ref$.key = null, ref$;
      }
      this.chosen.key = dataset.key;
      return this.chosen.dataset = dataset;
    };
    return $scope.remove = function(dataset){
      var this$ = this;
      return dataset['delete']().then(function(){
        return $scope.$apply(function(){
          return $scope.datasets = $scope.datasets.filter(function(it){
            return it.key !== dataset.key;
          });
        });
      });
    };
  });
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}