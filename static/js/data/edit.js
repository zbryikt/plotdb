// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('dataEditCtrl', ['$scope', '$interval', '$timeout', '$http', 'dataService', 'eventBus', 'plNotify', 'Paging'].concat(function($scope, $interval, $timeout, $http, dataService, eventBus, plNotify, Paging){
  eventBus.fire('loading.dimmer.on');
  import$($scope, {
    rawdata: "",
    dataset: null,
    worker: new Worker("/js/data/worker.js"),
    loading: false,
    inited: false,
    showGrid: true
  });
  $scope.$watch('inited', function(it){
    return eventBus.fire("loading.dimmer." + (it ? 'off' : 'on'));
  });
  $scope.name = null;
  $scope.clone = function(){
    if (!$scope.dataset || !$scope.dataset.key) {
      return;
    }
    $scope.dataset.key = null;
    $scope.dataset.name = $scope.dataset.name + " - Copy";
    return $scope.save();
  };
  $scope.save = function(locally){
    var promise;
    locally == null && (locally = false);
    if (!$scope.dataset) {
      return;
    }
    if (!$scope.user.authed()) {
      return $scope.auth.toggle(true);
    }
    promise = !$scope.dataset.name
      ? $scope.panel.name.prompt()
      : Promise.resolve();
    return promise.then(function(){
      var promise;
      $scope.$apply(function(){
        return eventBus.fire('loading.dimmer.on');
      });
      promise = null;
      if ($scope.grid.toggled) {
        promise = Promise.resolve();
      } else {
        $scope.$apply(function(){
          return promise = $scope.parser.csv.read($scope.rawdata, false);
        });
      }
      return promise.then(function(){
        var data, payload, isCreate;
        data = $scope.grid.data;
        if (data.headers.length >= 40) {
          eventBus.fire('loading.dimmer.off');
          return plNotify.send('danger', "maximal 40 columns is allowed. you have " + data.headers.length);
        }
        if (data.headers.lentgth === 0) {
          eventBus.fire('loading.dimmer.off');
          return plNotify.send('danger', "no data to save. add some?");
        }
        payload = $scope.grid.data.fieldize();
        $scope.dataset.setFields(payload);
        isCreate = !$scope.dataset.key ? true : false;
        return $scope.dataset.save().then(function(r){
          $scope.$apply(function(){
            return plNotify.send('success', "dataset saved");
          });
          if (isCreate) {
            if ($scope.$parent && $scope.$parent.inlineCreate) {
              $scope.$parent.inlineCreate($scope.dataset);
              $scope.$apply(function(){
                return eventBus.fire('loading.dimmer.off');
              });
            } else {
              setTimeout(function(){
                return window.location.href = dataService.link($scope.dataset);
              }, 1000);
            }
          } else {
            $scope.$apply(function(){
              return eventBus.fire('loading.dimmer.off');
            });
          }
          return eventBus.fire('dataset.saved', $scope.dataset);
        })['catch'](function(e){
          console.log(e.stack);
          return $scope.$apply(function(){
            plNotify.aux.error.io('save', 'data', e);
            return eventBus.fire('loading.dimmer.off');
          });
        });
      });
    });
  };
  $scope.load = function(_type, key){
    var worker, this$ = this;
    eventBus.fire('loading.dimmer.on');
    $scope.rawdata = "";
    worker = new Worker('/js/data/worker/parse-dataset.js');
    worker.onmessage = function(e){
      var data;
      data = e.data;
      $scope.$apply(function(){
        $scope.grid.data.headers = data.data.headers;
        $scope.grid.data.rows = data.data.rows;
        return $scope.grid.data.types = data.data.types;
      });
      return $scope.grid.render().then(function(){
        return $scope.$apply(function(){
          $scope.inited = true;
          $scope.loading = false;
          return eventBus.fire('loading.dimmer.off');
        });
      });
    };
    return dataService.load(_type, key).then(function(ret){
      return $scope.$apply(function(){
        var dataset;
        $scope.dataset = dataset = new dataService.dataset(ret);
        $scope.grid.data.size = JSON.stringify(dataset).length;
        return worker.postMessage({
          dataset: dataset
        });
      });
    })['catch'](function(ret){
      return $scope.$apply(function(){
        console.error(ret);
        plNotify.send('error', "failed to load dataset. please try reloading");
        if (ret[1] === 'forbidden') {
          window.location.href = '/403.html';
        }
        $scope.inited = true;
        $scope.loading = false;
        return eventBus.fire('loading.dimmer.off');
      });
    });
  };
  $scope['delete'] = function(dataset){
    if (!dataset || !dataset.key) {
      return;
    }
    return eventBus.fire('confirmbox.on', {
      title: 'Delete',
      message: 'Are you sure to delete this dataset?',
      options: ['Yes', 'Cancel'],
      callback: function(it){
        if (it === 1) {
          return;
        }
        eventBus.fire('loading.dimmer.on');
        return dataset['delete']().then(function(){
          plNotify.send('success', "dataset deleted");
          return $timeout(function(){
            return window.location.href = "/dataset/";
          }, 1300);
        })['catch'](function(ret){
          console.error(ret);
          return plNotify.send('error', "failed to delete dataset. please try later.");
        });
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
        return $scope.$apply(function(){
          if (typeof payload !== 'object') {
            return;
          }
          switch (payload.type) {
          case "parse.revert":
            $scope.rawdata = payload.data;
            $scope.loading = false;
            return eventBus.fire('loading.dimmer.off');
          }
        });
      };
    },
    reset: function(rawdata, force){
      var ref$, dataset;
      rawdata == null && (rawdata = "");
      force == null && (force = false);
      if (force) {
        if ($scope.$parent && $scope.$parent.inlineCreate) {
          $scope.dataset = new dataService.dataset();
          $scope.rawdata = rawdata || "";
          ref$ = $scope.grid.data;
          ref$.rows = [];
          ref$.headers = [];
          ref$.types = [];
          return $scope.grid.render();
        } else {
          return window.location.href = "/dataset/";
        }
      } else {
        dataset = new dataService.dataset(window.dataset || {});
        dataset.name = "";
        if ($scope.dataset && $scope.dataset.name) {
          dataset.name = $scope.dataset.name;
        }
        return $scope.dataset = dataset, $scope.rawdata = rawdata, $scope;
      }
    },
    init: function(){
      var ret1, ret2, that, ret;
      this.reset("");
      ret1 = /\/dataset\//.exec(window.location.pathname) ? /[?&]k=([sc])([^&?#]+)/.exec(window.location.search || "") : null;
      ret2 = /^\/data(s)et\/([0-9]+)\/?/.exec(window.location.pathname || "");
      if (that = ret1 || ret2) {
        ret = that;
        $scope.dataset.key = ret[2];
        $scope.load({
          location: ret[1] === 's' ? 'server' : 'local',
          name: 'dataset'
        }, ret[2]);
      } else {
        eventBus.fire('loading.dimmer.off');
        $scope.inited = true;
      }
      $('#dataset-edit-text').on('keydown', function(){
        return $scope.$apply(function(){
          return $scope.parse.run();
        });
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
      $scope.loading = true;
      return $scope.worker.postMessage({
        type: "parse.revert",
        data: dataset
      });
    },
    promise: null,
    run: function(force){
      var this$ = this;
      force == null && (force = false);
      return new Promise(function(res, rej){
        var _;
        $scope.loading = true;
        _ = function(){
          $scope.parser.csv.read($scope.rawdata, false);
          return res();
        };
        if (this$.handle) {
          $timeout.cancel(this$.handle);
          if (this$.promise) {
            this$.promise.rej();
          }
        }
        this$.promise = {
          res: res,
          rej: rej
        };
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
    progress: function(sec){
      var progress, this$ = this;
      sec == null && (sec = 2000);
      progress = 0;
      if (this.progressHandler) {
        $interval.cancel(this.progressHandler);
      }
      return this.progressHandler = $interval(function(){
        progress = progress + (100 - progress) / (progress < 80 ? 4 : 8);
        if (progress > 97) {
          $interval.cancel(this$.progressHandler);
          this$.progresHandler = 0;
        }
        return eventBus.fire('loading.dimmer.progress', progress);
      }, sec / 6);
    }
  };
  $scope.parser.csv = {
    encodings: ['UTF-8', 'BIG5', 'GB2312', 'ISO-8859-1'],
    encoding: 'UTF-8',
    worker: null,
    toggle: function(v){
      return this.toggled = v != null
        ? v
        : !this.toggled;
    },
    toggled: false,
    'import': function(buf){
      var node;
      node = document.getElementById('dataset-import-dropdown');
      node.className = node.className.replace(/open/, '');
      $scope.parser.csv.buf = buf;
      return $scope.parser.csv.toggle(true);
    },
    read: function(_buf, verbose){
      var this$ = this;
      verbose == null && (verbose = true);
      return new Promise(function(res, rej){
        var buf, sec;
        buf = _buf;
        if (!(buf != null)) {
          buf = this$.buf;
        }
        if (!buf) {
          buf = "";
        }
        if (verbose) {
          eventBus.fire('loading.dimmer.on', 1);
        }
        sec = buf.length * 1.3 / 1000;
        $scope.parser.progress(sec);
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/csv.js');
        }
        this$.worker.onmessage = function(e){
          var data;
          data = e.data.data;
          $scope.$apply(function(){
            $scope.grid.data.rows = data.rows;
            $scope.grid.data.headers = data.headers;
            $scope.grid.data.types = data.types;
            return $scope.grid.data.size = buf.length;
          });
          return $scope.grid.render({
            trs: data.trs,
            ths: data.ths
          }).then(function(){
            return $scope.$apply(function(){
              this$.toggle(false);
              this$.buf = null;
              if (verbose) {
                eventBus.fire('loading.dimmer.off');
              }
              $scope.loading = false;
              return res();
            });
          });
        };
        return this$.worker.postMessage({
          buf: buf
        });
      });
    }
  };
  $scope.parser.xls = {
    worker: null,
    read: function(buf){
      var sec, node, this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      sec = buf.length * 2.5 / 1000;
      $scope.parser.progress(sec);
      if (!this.worker) {
        this.worker = new Worker('/js/data/worker/excel.js');
        this.worker.onmessage = function(e){
          return $scope.$apply(function(){
            var data;
            data = e.data.data;
            $scope.grid.data.headers = data.headers;
            $scope.grid.data.rows = data.rows;
            $scope.grid.data.types = data.types;
            $scope.grid.data.size = buf.length;
            return $scope.grid.render({
              trs: data.trs,
              ths: data.ths
            }).then(function(){
              return $scope.$apply(function(){
                return eventBus.fire('loading.dimmer.off');
              });
            });
          });
        };
      }
      node = document.getElementById('dataset-import-dropdown');
      node.className = node.className.replace(/open/, '');
      return $timeout(function(){
        return this$.worker.postMessage({
          buf: buf
        });
      }, 100);
    }
  };
  $scope.parser.gsheet = {
    url: null,
    apiKey: 'AIzaSyD3emlU63t6e_0n9Zj9lFCl-Rwod0OMTqY',
    clientId: '1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com',
    scopes: ['profile', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'].join(' '),
    init: function(){
      var this$ = this;
      return gapi.load('client:auth2', function(){
        gapi.client.load('drive', 'v3');
        gapi.client.setApiKey(this$.apiKey);
        gapi.auth2.init({
          client_id: this$.clientId,
          scope: this$.scopes
        });
        if ($('#gsheet-list-end')) {
          return Paging.loadOnScroll(function(){
            return $scope.parser.gsheet.list();
          }, $('#gsheet-list-end'), $('#gsheet-files'));
        }
      });
    },
    files: [],
    auth: function(){
      var auth;
      auth = gapi.auth2.getAuthInstance();
      if (auth.isSignedIn.get()) {
        return auth;
      } else {
        eventBus.fire('loading.dimmer.on');
        return auth.signIn();
      }
    },
    list: function(){
      var this$ = this;
      if (this.loading) {
        return;
      }
      this.loading = true;
      return this.auth().then(function(){
        var config, request;
        eventBus.fire('loading.dimmer.off');
        config = {
          pageSize: 40,
          fields: "nextPageToken, files(id, name)",
          q: "mimeType='application/vnd.google-apps.spreadsheet'"
        };
        if (this$.pageToken) {
          config.pageToken = this$.pageToken;
        }
        request = gapi.client.drive.files.list(config);
        return request.execute(function(ret){
          this$.pageToken = ret.nextPageToken;
          return $scope.$apply(function(){
            this$.files = this$.files.concat(ret.files);
            return this$.loading = false;
          });
        });
      });
    },
    toggle: function(){
      this.toggled = !this.toggled;
      if (this.toggled && !this.files.length) {
        return this.list();
      }
    },
    load: function(file){
      var this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(function(){
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: file.id,
          range: 'A:ZZ'
        });
      }).then(function(ret){
        var list, data;
        list = ret.result.values;
        data = $scope.grid.data;
        $scope.$apply(function(){
          var h;
          data.headers = h = list[0];
          list.splice(0, 1);
          data.rows = list;
          data.types = plotdb.Types.resolve(data);
          return data.size = (ret.body || "").length;
        });
        return $scope.grid.render().then(function(){
          return $scope.$apply(function(){
            this$.toggled = false;
            return eventBus.fire('loading.dimmer.off');
          });
        });
      }, function(){
        var this$ = this;
        return $scope.$apply(function(){
          plNotify.send('danger', "can't load sheet, try again later?");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    }
  };
  $scope.panel = {
    name: {
      promise: null,
      toggle: function(name){
        return this.value = name, this.toggled = true, this;
      },
      prompt: function(){
        var this$ = this;
        return new Promise(function(res, rej){
          return this$.promise = {
            res: res,
            rej: rej
          }, this$.toggled = true, this$;
        });
      },
      value: "",
      action: function(idx){
        if (idx === 0) {
          if (!this.value) {
            return;
          }
          ($scope.dataset || ($scope.dataset = {})).name = this.value;
          $('#dataset-name').text(this.value);
        }
        this.toggled = false;
        if (this.promise) {
          if (idx) {
            return this.promise.rej();
          } else if (!idx) {
            return this.promise.res(this.value);
          }
        }
      }
    },
    toggle: function(name){
      if (!($scope.dataset || ($scope.dataset = {})).key) {
        if (!name) {
          return;
        }
      }
      if (name) {
        return (this[name] || (this[name] = {})).toggled = !(this[name] || (this[name] = {})).toggled;
      } else {
        return this.toggled = !this.toggled;
      }
    }
  };
  eventBus.listen('dataset.delete', function(key){
    if ($scope.dataset.key === key) {
      return $scope.dataset = null;
    }
  });
  eventBus.listen('dataset.edit', function(dataset, load){
    load == null && (load = true);
    $scope.inited = false;
    if (load && dataset._type.location === 'server') {
      return $scope.load(dataset._type, dataset.key);
    } else {
      $scope.dataset = new dataService.dataset(dataset);
      $scope.parse.revert($scope.dataset);
      return $scope.inited = true;
    }
  });
  $scope.grid = {
    toggled: true,
    _toggle: function(v){
      this.toggled = v;
      if (!this.toggled) {
        return this.convert();
      }
    },
    toggle: function(v){
      var ret, this$ = this;
      ret = v
        ? v
        : !this.toggled;
      if (!ret && this.data.rows.length > 1000) {
        return eventBus.fire('confirmbox.on', {
          title: "Wait!",
          message: "Raw editing in a large dataset will be very slow. Are you sure?",
          options: ['Yes', 'Cancel'],
          callback: function(it){
            if (it === 0) {
              return this$._toggle(ret);
            }
          }
        });
      } else {
        return this._toggle(ret);
      }
    },
    convert: function(){
      var ref$;
      eventBus.fire('loading.dimmer.on');
      if (!this.convertWorker) {
        this.convertWorker = new Worker('/js/data/worker/data-to-raw-wrap.js');
      }
      this.convertWorker.onmessage = function(e){
        return $scope.$apply(function(){
          $scope.rawdata = e.data.raw.trim();
          return eventBus.fire('loading.dimmer.off');
        });
      };
      return this.convertWorker.postMessage({
        headers: (ref$ = this.data).headers,
        rows: ref$.rows,
        types: ref$.types
      });
    },
    worker: null,
    data: {
      rows: [],
      headers: [],
      trs: [],
      clusterizer: null,
      fieldize: function(){
        var ret, i$, to$, i, j$, to1$, j, ref$, this$ = this;
        ret = this.headers.map(function(d, i){
          return {
            data: [],
            datatype: this$.types[i],
            name: d
          };
        });
        for (i$ = 0, to$ = this.rows.length; i$ < to$; ++i$) {
          i = i$;
          for (j$ = 0, to1$ = this.headers.length; j$ < to1$; ++j$) {
            j = j$;
            ret[j].data.push(((ref$ = this.rows)[i] || (ref$[i] = []))[j]);
          }
        }
        return ret;
      }
    },
    render: function(obj){
      var headOnly, ths, trs, this$ = this;
      obj == null && (obj = {});
      headOnly = obj.headOnly, ths = obj.ths, trs = obj.trs;
      return new Promise(function(res, rej){
        var head, scroll, content, update;
        head = document.querySelector('#dataset-editbox .sheet .sheet-head');
        scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
        content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/grid-render-wrap.js');
        }
        update = function(trs, ths){
          var that;
          head.innerHTML = ths;
          if (headOnly) {
            return res();
          }
          content.innerHTML = "";
          if (that = this$.data.clusterizer) {
            that.destroy(true);
          }
          this$.data.clusterizer = new Clusterize({
            rows: trs,
            scrollElem: scroll,
            contentElem: content
          });
          return res();
        };
        if (trs && ths) {
          return update(trs, ths);
        }
        this$.worker.onmessage = function(e){
          var ref$, trs, ths;
          ref$ = [e.data.trs, e.data.ths], trs = ref$[0], ths = ref$[1];
          return update(trs, ths);
        };
        if (headOnly) {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            types: this$.data.types
          });
        } else {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            rows: this$.data.rows,
            types: this$.data.types
          });
        }
      });
    },
    update: function(r, c, val){
      var dirty, i$, i, ref$, j, that, valtype;
      dirty = false;
      if (c >= this.data.headers.length) {
        for (i$ = this.data.headers.length; i$ <= c; ++i$) {
          i = i$;
          this.data.headers[i] = '';
        }
      }
      if (r >= this.data.rows.length) {
        for (i$ = this.data.rows.length; i$ <= r; ++i$) {
          i = i$;
          this.data.rows[i] = [];
        }
      }
      if (r === -1) {
        if (!this.data.headers[c] && !val) {
          return;
        }
        this.data.headers[c] = val;
      }
      if (r >= 0 && !((ref$ = this.data.rows)[r] || (ref$[r] = []))[c] && !val) {
        return;
      }
      if (c >= ((ref$ = this.data).types || (ref$.types = [])).length) {
        for (i$ = this.data.types.length; i$ <= c; ++i$) {
          i = i$;
          this.data.types[i] = plotdb.Types.resolve((fn$.call(this)));
          this.data.headers[i] = (that = this.data.headers[i]) ? that : '';
        }
        dirty = true;
      }
      if (r >= 0) {
        this.data.rows[r][c] = val;
        valtype = plotdb.Types.resolve(val);
        if (valtype !== this.data.types[c]) {
          this.data.types[c] = plotdb.Types.resolve((function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = this.data.rows.length; i$ < to$; ++i$) {
              i = i$;
              results$.push(this.data.rows[i][c]);
            }
            return results$;
          }.call(this)));
          dirty = true;
        }
      }
      if (dirty) {
        return this.render({
          headOnly: true
        }).then(function(){
          var node, range, sel;
          if (r < 0) {
            node = document.querySelector('#dataset-editbox .sheet-head > div >' + (" div:nth-of-type(" + (c + 1) + ") > div:first-child"));
          } else {
            node = document.querySelector(['#dataset-editbox .sheet-cells >', "div:nth-of-type(" + (r + 1) + ") >", "div:nth-of-type(" + (c + 1) + ")"].join(" "));
          }
          if (node) {
            node.focus();
            range = document.createRange();
            range.setStart(node, 1);
            range.collapse(true);
            sel = window.getSelection();
            sel.removeAllRanges();
            return sel.addRange(range);
          }
        });
      }
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = this.data.rows.length; i$ < to$; ++i$) {
          j = i$;
          results$.push(this.data.rows[j][i]);
        }
        return results$;
      }
    },
    empty: function(){
      this.data.headers = [];
      this.data.rows = [];
      return this.render();
    },
    init: function(){
      var head, scroll, content, this$ = this;
      this.empty();
      head = document.querySelector('#dataset-editbox .sheet .sheet-head');
      scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
      content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
      scroll.addEventListener('scroll', function(e){
        return head.scrollLeft = scroll.scrollLeft;
      });
      head.addEventListener('click', function(e){
        var data, col, node, that;
        if (/closebtn/.exec(e.target.className)) {
          data = $scope.grid.data;
          col = +e.target.getAttribute('col');
          return $scope.$apply(function(){
            eventBus.fire('loading.dimmer.on');
            return $timeout(function(){
              data.headers.splice(col, 1);
              data.rows.map(function(row){
                return row.splice(col, 1);
              });
              data.types.splice(col, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  return eventBus.fire('loading.dimmer.off');
                });
              });
            }, 0);
          });
        } else {
          col = +e.target.getAttribute('col');
          if (!isNaN(col)) {
            node = head.querySelector(".sheet-head > div > div:nth-of-type(" + (col + 1) + ") > div:first-child");
            if (that = node) {
              return that.focus();
            }
          }
        }
      });
      head.addEventListener('keydown', function(e){
        return setTimeout(function(){
          var key, n, val, col, v, node, that;
          key = e.keyCode;
          n = e.target;
          val = n.textContent.trim();
          col = +n.getAttribute('col');
          if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (v[1] > 0) {
              node = content.querySelector([".sheet-cells >", "div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ")"].join(" "));
            } else {
              node = head.querySelector([".sheet-head > div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") > div:first-child"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return this$.update(-1, col, val);
          }
        }, 0);
      });
      return content.addEventListener('keydown', function(e){
        return setTimeout(function(){
          var key, n, val, row, col, h, v, node, that;
          key = e.keyCode;
          n = e.target;
          val = n.textContent;
          row = +n.getAttribute('row');
          col = +n.getAttribute('col');
          h = col;
          if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (row === 0 && v[1] < 0) {
              node = head.querySelector([".sheet-head > div >", "div:nth-of-type(" + (col + 1) + ") > div:first-child"].join(" "));
            } else {
              node = content.querySelector([".sheet-cells >", "div:nth-of-type(" + (row + 1 + v[1]) + ") >", "div:nth-of-type(" + (col + 1 + v[0]) + ")"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return this$.update(row, h, val);
          }
        }, 0);
      });
    }
  };
  $scope.init();
  $scope.grid.init();
  return $scope.parser.gsheet.init();
}));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}