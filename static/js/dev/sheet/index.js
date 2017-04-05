// Generated by LiveScript 1.3.1
var x$;
x$ = angular.module('plotDB');
x$.controller('plSheetEditor', ['$scope', '$interval', '$timeout', '$http', 'permService', 'dataService', 'eventBus', 'plNotify', 'Paging', 'initWrap'].concat(function($scope, $interval, $timeout, $http, permService, dataService, eventBus, plNotify, Paging, initWrap){
  initWrap = initWrap();
  $scope.sheetModal = {
    duplicate: {}
  };
  $scope.dataset = initWrap({
    init: function(){
      var this$ = this;
      eventBus.listen('sheet.dataset.load', function(key, bindmap, force){
        return this$.load(key, force).then(function(){
          return eventBus.fire('sheet.dataset.loaded', key);
        });
      });
      eventBus.listen('sheet.dataset.parse', function(key, bindmap, force){
        return this$.load(key, force).then(function(){
          return $scope.parser.plotdb.parse(this$.obj, bindmap);
        }).then(function(dataset){
          return eventBus.fire('sheet.dataset.parsed', dataset);
        });
      });
      return eventBus.listen('sheet.dataset.save', function(name){
        return this$.save(name);
      });
    },
    obj: null,
    clear: function(){
      return this.obj = null;
    },
    save: function(name){
      var fresh, this$ = this;
      name == null && (name = 'Untitled');
      name = name + " (Dataset)";
      fresh = this.obj
        ? !this.obj.key
        : !this.obj;
      return Promise.resolve().then(function(){
        if (!$scope.user.authed()) {
          $scope.auth.toggle(true);
          return Promise.reject();
        }
        if (fresh) {
          this$.obj = new dataService.dataset();
          this$.obj.name = name;
        }
        this$.obj.setFields($scope.grid.data.fieldize());
        if (this$.obj.fields.length >= 40) {
          alert('You can have at most 40 columns');
          this$.obj = null;
          return Promise.reject();
        }
        if (!this$.obj.name) {
          return this$.obj.name = name;
        } else {
          return Promise.resolve();
        }
      }).then(function(){
        return this$.obj.save()['catch'](function(){
          eventBus.fire('loading.dimmer.pause');
          return $scope.sheetModal.duplicate.prompt().then(function(){
            fresh = true;
            this$.obj.key = null;
            return this$.obj.save();
          });
        });
      }).then(function(r){
        eventBus.fire('loading.dimmer.continue');
        if (fresh) {
          return new Promise(function(res, rej){
            return $http({
              url: "/d/dataset/" + this$.obj.key + "/simple",
              method: 'GET'
            }).success(function(map){
              map.fields.map(function(d, i){
                var ref$;
                return ref$ = this$.obj.fields[i], ref$.dataset = this$.obj.key, ref$.key = d.key, ref$;
              });
              return res();
            }).error(function(it){
              return console.log("error:", it(rej()));
            });
          });
        } else {
          return Promise.resolve();
        }
      }).then(function(){
        return eventBus.fire('sheet.dataset.saved', this$.obj);
      })['catch'](function(it){
        return eventBus.fire('sheet.dataset.save.failed', it);
      });
    },
    load: function(key, force, location){
      var this$ = this;
      location == null && (location = 'server');
      if (!this.obj || this.obj.key !== key || !force) {
        return dataService.load({
          location: location,
          name: 'dataset'
        }, key).then(function(ret){
          var dataset;
          this$.obj = dataset = new dataService.dataset(ret);
          eventBus.fire('sheet.dataset.loaded', this$.obj);
          return this$.obj;
        });
      } else {
        return Promise.resolve().then(function(){
          eventBus.fire('sheet.dataset.loaded', this.obj);
          return this.obj;
        });
      }
    },
    clone: function(){},
    'delete': function(){}
  });
  $scope.grid = initWrap({
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
    clear: true,
    worker: null,
    data: {
      rows: [],
      headers: [],
      trs: [],
      bind: [],
      dimkeys: [],
      clusterizer: null,
      bindField: function(e){
        var node, dim, multi, i$, to$, i, index, root;
        node = e.target || e.srcElement;
        if (node.nodeName.toLowerCase() !== 'a') {
          return;
        }
        dim = node.getAttribute('data-dim') || '';
        multi = (node.getAttribute('data-multi') || 'false') === 'true';
        if (dim && !multi) {
          for (i$ = 0, to$ = this.bind.length; i$ < to$; ++i$) {
            i = i$;
            if (this.bind[i] === dim) {
              this.bind[i] = null;
            }
          }
        }
        index = Array.from(node.parentNode.parentNode.parentNode.parentNode.childNodes).indexOf(node.parentNode.parentNode.parentNode);
        this.bind[index] = dim || null;
        root = node.parentNode.parentNode.parentNode.parentNode;
        this.bindFieldSync();
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      },
      bindFieldSync: function(){
        var root, i$, to$, i, span, results$ = [];
        root = document.querySelector('#dataset-editbox .sheet .sheet-dim > div');
        if (!root || !root.childNodes) {
          return;
        }
        for (i$ = this.headers.length, to$ = root.childNodes.length; i$ < to$; ++i$) {
          i = i$;
          span = root.childNodes[i].querySelector("span");
          span.innerText = "(empty)";
          span.className = 'grayed';
          this.bind[i] = null;
        }
        for (i$ = 0, to$ = this.headers.length; i$ < to$; ++i$) {
          i = i$;
          if (!root.childNodes[i]) {
            continue;
          }
          span = root.childNodes[i].querySelector("span");
          span.innerText = this.bind[i] || "(empty)";
          results$.push(span.className = this.bind[i] ? '' : 'grayed');
        }
        return results$;
      },
      fieldize: function(){
        var ret, i$, to$, i, j$, to1$, j, ref$, this$ = this;
        ret = this.headers.map(function(d, i){
          return {
            data: [],
            datatype: this$.types[i],
            name: d,
            bind: this$.bind[i],
            key: this$.keys[i],
            dataset: this$.datasets[i]
          };
        });
        for (i$ = 0, to$ = this.rows.length; i$ < to$; ++i$) {
          i = i$;
          if (!this.rows[i].filter(fn$).length) {
            continue;
          }
          for (j$ = 0, to1$ = this.headers.length; j$ < to1$; ++j$) {
            j = j$;
            ret[j].data.push(((ref$ = this.rows)[i] || (ref$[i] = []))[j]);
          }
        }
        return ret;
        function fn$(it){
          return it;
        }
      }
    },
    render: function(obj){
      var headOnly, ths, trs, this$ = this;
      obj == null && (obj = {});
      headOnly = obj.headOnly, ths = obj.ths, trs = obj.trs;
      return new Promise(function(res, rej){
        var dim, head, scroll, content, rowcount, update;
        dim = document.querySelector('#dataset-editbox .sheet .sheet-dim');
        head = document.querySelector('#dataset-editbox .sheet .sheet-head');
        scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
        content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
        rowcount = +head.getAttribute('data-rowcount') || 10;
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/grid-render-wrap.js');
        }
        update = function(trs, ths, dimnode){
          var that;
          if (dim) {
            dim.innerHTML = dimnode;
          }
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
          this$.data.bindFieldSync();
          return res();
        };
        if (trs && ths) {
          return update(trs, ths);
        }
        this$.worker.onmessage = function(e){
          var ref$, trs, ths, dimnode;
          ref$ = [e.data.trs, e.data.ths, e.data.dim], trs = ref$[0], ths = ref$[1], dimnode = ref$[2];
          return update(trs, ths, dimnode);
        };
        if (headOnly) {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            types: this$.data.types,
            bind: this$.data.bind,
            dimkeys: this$.data.dimkeys,
            rowcount: rowcount
          });
        } else {
          return this$.worker.postMessage({
            headers: this$.data.headers,
            rows: this$.data.rows,
            types: this$.data.types,
            bind: this$.data.bind,
            dimkeys: this$.data.dimkeys,
            rowcount: rowcount
          });
        }
      });
    },
    update: function(r, c, val, headOnly){
      var dirty, i$, i, ref$, j, that, valtype, this$ = this;
      headOnly == null && (headOnly = true);
      dirty = false;
      if (c >= this.data.headers.length && val) {
        for (i$ = this.data.headers.length; i$ <= c; ++i$) {
          i = i$;
          this.data.headers[i] = '';
        }
        headOnly = false;
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
      if (c >= ((ref$ = this.data).types || (ref$.types = [])).length && val) {
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
      for (i$ = this.data.rows.length - 1; i$ >= 0; --i$) {
        i = i$;
        if (this.data.rows[i].filter(fn1$).length) {
          break;
        }
      }
      this.data.rows.splice(i + 1);
      for (i$ = this.data.types.length - 1; i$ >= 0; --i$) {
        i = i$;
        if (this.data.rows.filter(fn2$).length || this.data.headers[i]) {
          break;
        }
      }
      if (i < this.data.types.length - 1) {
        this.data.headers.splice(i + 1, 1);
        this.data.rows.map(function(row){
          return row.splice(i + 1, 1);
        });
        this.data.types.splice(i + 1);
        dirty = true;
      }
      eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      if (dirty) {
        return this.render({
          headOnly: headOnly
        }).then(function(){
          var node, range;
          this$.clear = false;
          if (r < 0) {
            node = document.querySelector('#dataset-editbox .sheet-head > div >' + (" div:nth-of-type(" + (c + 1) + ") > textarea:first-child"));
          } else {
            node = document.querySelector(['#dataset-editbox .sheet-cells >', "div:nth-of-type(" + (r + 1) + ") >", "div:nth-of-type(" + (c + 1) + ") textarea"].join(" "));
          }
          if (node) {
            node.focus();
            if (node.setSelectionRange) {
              return node.setSelectionRange(1, 1);
            } else {
              range = node.createTextRange();
              range.collapse(true);
              range.moveEnd('character', 1);
              range.moveStart('character', 1);
              return range.select();
            }
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
      function fn1$(it){
        return it;
      }
      function fn2$(it){
        return it[i];
      }
    },
    empty: function(render){
      var ref$;
      ref$ = this.data;
      ref$.headers = [];
      ref$.rows = [];
      ref$.types = [];
      ref$.keys = [];
      ref$.datasets = [];
      ref$.bind = [];
      this.clear = true;
      if (render) {
        return this.render();
      }
    },
    init: function(){
      var head, dim, scroll, content, this$ = this;
      eventBus.listen('sheet.grid.isClear.get', function(){
        return eventBus.fire('sheet.grid.isClear', this$.clear);
      });
      eventBus.listen('sheet.grid.load', function(){
        return eventBus.fire('sheet.grid.loaded', this$.data.fieldize());
      });
      eventBus.listen('sheet.bind', function(dimkeys, bindmap){
        var ref$;
        ref$ = this$.data;
        ref$.dimkeys = dimkeys;
        ref$.bindmap = bindmap;
        this$.render();
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
      this.empty();
      head = document.querySelector('#dataset-editbox .sheet .sheet-head');
      dim = document.querySelector('#dataset-editbox .sheet .sheet-dim');
      scroll = document.querySelector('#dataset-editbox .sheet .clusterize-scroll');
      content = document.querySelector('#dataset-editbox .sheet .clusterize-content');
      scroll.addEventListener('scroll', function(e){
        head.scrollLeft = scroll.scrollLeft;
        if (dim && dim.childNodes[0]) {
          return dim.childNodes[0].style.left = (-scroll.scrollLeft) + "px";
        }
      });
      content.addEventListener('click', function(e){
        var data, row;
        if (/closebtn/.exec(e.target.className)) {
          data = $scope.grid.data;
          row = +e.target.getAttribute('row');
          return $scope.$apply(function(){
            return $timeout(function(){
              eventBus.fire('loading.dimmer.on');
              data.rows.splice(row, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  eventBus.fire('loading.dimmer.off');
                  return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
                });
              });
            }, 0);
          });
        }
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
              data.bind.splice(col, 1);
              return $scope.grid.render().then(function(){
                return $scope.$apply(function(){
                  eventBus.fire('loading.dimmer.off');
                  return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
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
        var pPos, key, n, val;
        pPos = e.target.selectionStart;
        key = e.keyCode;
        n = e.target;
        val = n.value.trim() || n.textContent.trim();
        if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
          return n.value = "";
        }
        return setTimeout(function(){
          var val, cPos, col, v, node, that;
          val = n.value.trim() || n.textContent.trim();
          val = (n.value.trim() || n.textContent.trim()).replace(/\n/g, '');
          cPos = e.target.selectionStart;
          col = +n.getAttribute('col');
          if (key === 13) {
            key = 40;
          }
          if (key === 39 && (pPos !== cPos || cPos < val.length)) {
            return;
          }
          if (key === 37 && (pPos !== cPos || cPos > 0)) {
            return;
          }
          if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
            return this$.paste(-1, col, val);
          } else if (key >= 37 && key <= 40) {
            v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
            if (v[1] > 0) {
              node = content.querySelector([".sheet-cells >", "div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") textarea"].join(" "));
            } else {
              node = head.querySelector([".sheet-head > div:first-child >", "div:nth-of-type(" + (col + 1 + v[0]) + ") > textarea:first-child"].join(" "));
            }
            if (that = node) {
              return that.focus();
            }
          } else {
            return $scope.$apply(function(){
              return this$.update(-1, col, val);
            });
          }
        }, 0);
      });
      head.addEventListener('input', function(e){
        var key, n, val, col;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        col = +n.getAttribute('col');
        if (/\t/.exec(val)) {
          return this$.paste(-1, col, val);
        } else if (/\n/.exec(val)) {
          return val = n.value = val.replace(/\n/g, '');
        }
      });
      content.addEventListener('input', function(e){
        var key, n, val, row, col;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        row = +n.getAttribute('row');
        col = +n.getAttribute('col');
        if (/\t/.exec(val)) {
          return this$.paste(row, col, val);
        } else if (/\n/.exec(val)) {
          return val = n.value = val.replace(/\n/g, '');
        }
      });
      return content.addEventListener('keydown', function(e){
        var pPos, key, n, val;
        pPos = e.target.selectionStart;
        key = e.keyCode;
        n = e.target;
        val = n.value;
        if (key === 86 && e.metaKey || e.ctrlKey && /\t/.exec(val)) {
          return n.value = "";
        }
        if (n) {
          return setTimeout(function(){
            var val, cPos, row, col, h, v, node, that;
            if (n.getAttribute('col') == null) {
              return;
            }
            val = (n.value || '').replace(/\n/g, '');
            cPos = e.target.selectionStart;
            row = +n.getAttribute('row');
            col = +n.getAttribute('col');
            h = col;
            if (key === 13) {
              key = 40;
            }
            if (key === 39 && (pPos !== cPos || cPos < val.length)) {
              return;
            }
            if (key === 37 && (pPos !== cPos || cPos > 0)) {} else if (key >= 37 && key <= 40) {
              v = [[-1, 0], [0, -1], [1, 0], [0, 1]][key - 37];
              if (row === 0 && v[1] < 0) {
                node = head.querySelector([".sheet-head > div >", "div:nth-of-type(" + (col + 1) + ") > textarea:first-child"].join(" "));
              } else {
                node = content.querySelector([".sheet-cells >", "div:nth-of-type(" + (row + 1 + v[1]) + ") >", "div:nth-of-type(" + (col + 1 + v[0]) + ") textarea"].join(" "));
              }
              if (that = node) {
                return that.focus();
              }
            } else {
              return $scope.$apply(function(){
                return this$.update(row, h, val);
              });
            }
          }, 0);
        }
      });
    },
    paste: function(row, col, val){
      var head, data, ret, w, h, curRowSize, curColSize, newRowSize, newColSize, i$, i, r, j$, c, ref$, key$, to$, j, this$ = this;
      head = null;
      eventBus.fire('loading.dimmer.on');
      data = $scope.grid.data;
      ret = val.split('\n').map(function(it){
        return it.split('\t');
      });
      if (row === -1) {
        head = ret.splice(0, 1)[0];
        row = 0;
      }
      w = Math.max.apply(null, ret.map(function(it){
        return it.length;
      }));
      h = ret.length;
      curRowSize = data.rows.length;
      curColSize = data.headers.length;
      newRowSize = row + h - 1 < curRowSize
        ? curRowSize
        : row + h - 1;
      newColSize = col + w - 1 < curColSize
        ? curColSize
        : col + w - 1;
      if (newColSize > curColSize) {
        for (i$ = curColSize; i$ < newColSize; ++i$) {
          i = i$;
          data.headers[i] = "";
        }
      }
      if (head) {
        for (i$ = 0; i$ < w; ++i$) {
          i = i$;
          data.headers[i + col] = head[i];
        }
      }
      if (newRowSize > curRowSize) {
        data.rows.push((function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = newColSize; i$ < to$; ++i$) {
            i = i$;
            results$.push("");
          }
          return results$;
        }()));
      }
      for (i$ = 0; i$ < h; ++i$) {
        r = i$;
        for (j$ = 0; j$ < w; ++j$) {
          c = j$;
          ((ref$ = data.rows)[key$ = r + row] || (ref$[key$] = []))[c + col] = ret[r][c];
        }
      }
      for (i$ = col, to$ = col + w; i$ < to$; ++i$) {
        i = i$;
        data.types[i] = plotdb.Types.resolve((fn$()));
      }
      return $scope.grid.render().then(function(){
        this$.clear = false;
        eventBus.fire('loading.dimmer.off');
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = data.rows.length; i$ < to$; ++i$) {
          j = i$;
          results$.push(data.rows[j][i]);
        }
        return results$;
      }
    },
    load: function(data, size){
      var i$, ref$, len$, k, this$ = this;
      size == null && (size = 0);
      for (i$ = 0, len$ = (ref$ = ['headers', 'rows', 'types', 'keys', 'datasets', 'bind']).length; i$ < len$; ++i$) {
        k = ref$[i$];
        if (data[k]) {
          this.data[k] = data[k];
        }
      }
      this.data.size = size;
      if (this.data.bindmap) {
        this.data.bind = this.data.keys.map(function(it){
          return this$.data.bindmap[it] || null;
        });
        this.data.bindmap = null;
      }
      return this.render().then(function(){
        this$.clear = false;
        return eventBus.fire('sheet.dataset.changed', $scope.grid.data.fieldize());
      });
    }
  });
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
  $scope.parser.fields = initWrap({
    init: function(){
      eventBus.listen('sheet.data.clear', function(){
        $scope.dataset.clear();
        return $scope.grid.empty(true);
      });
      return eventBus.listen('sheet.data.set', function(data){
        var x$, payload;
        x$ = payload = {};
        x$.headers = data.map(function(it){
          return it.name;
        });
        x$.rows = data[0].data.map(function(d, i){
          return data.map(function(e, j){
            return e.data[i];
          });
        });
        x$.types = data.map(function(it){
          return it.datatype || 'Number';
        });
        x$.keys = data.map(function(){
          return 0;
        });
        x$.datasets = data.map(function(){
          return 0;
        });
        x$.bind = data.map(function(it){
          return it.bind;
        });
        return $scope.grid.load(payload);
      });
    }
  });
  $scope.parser.plotdb = {
    toggled: false,
    worker: null,
    toggle: function(v){
      return this.toggled = v != null
        ? v
        : !this.toggled;
    },
    parse: function(dataset, bindmap){
      var this$ = this;
      bindmap == null && (bindmap = null);
      return new Promise(function(res, rej){
        if (!this$.worker) {
          this$.worker = new Worker('/js/data/worker/parse-dataset.js');
        }
        this$.worker.onmessage = function(arg$){
          var payload;
          payload = arg$.data;
          return $scope.$apply(function(){
            if (bindmap) {
              payload.data.bind = payload.data.keys.map(function(it){
                return bindmap[it];
              });
            }
            $scope.grid.empty(false);
            return $scope.grid.load(payload.data, dataset.size).then(function(){
              return res(dataset);
            });
          });
        };
        return this$.worker.postMessage({
          dataset: dataset
        });
      });
    },
    load: function(dataset){
      var this$ = this;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return $scope.dataset.load(dataset.key, true, dataset._type.location)['finally'](function(){
        this$.toggle(false);
        return eventBus.fire('loading.dimmer.off');
      }).then(function(it){
        return this$.parse(it);
      });
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
    askencoding: function(it){
      $scope.parser.csv.callback = it;
      return $scope.parser.csv.toggle(true);
    },
    gotencoding: function(){
      return this.callback();
    },
    'import': function(buf, file){
      var node;
      file == null && (file = {});
      if (file.name && !/\.csv$/.exec(file.name)) {
        alert("it's not a CSV file");
        return;
      }
      node = document.getElementById('dataset-import-dropdown') || document.getElementById('dataset-import-dropdown-inline');
      node.className = node.className.replace(/open/, '');
      $scope.parser.csv.buf = buf;
      $scope.parser.csv.toggle(false);
      return $scope.parser.csv.read();
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
          return $scope.$apply(function(){
            var data;
            data = e.data.data;
            $scope.grid.empty(false);
            return $scope.grid.load(data, buf.length).then(function(){
              this$.toggle(false);
              this$.buf = null;
              if (verbose) {
                eventBus.fire('loading.dimmer.off');
              }
              $scope.loading = false;
              $scope.dataset.clear();
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
    sheets: {
      toggled: false,
      toggle: function(it){
        var res;
        this.toggled = it != null
          ? it
          : !this.toggled;
        if (!this.toggled && this.promise) {
          res = this.promise.res;
          this.promise = null;
          return res();
        }
      },
      list: [],
      title: null,
      choose: function(it){
        this.title = it;
        $scope.parser.progress($scope.parser.xls.sec);
        eventBus.fire('loading.dimmer.on', 1);
        this.toggle(false);
        return $scope.parser.xls.worker.postMessage({
          type: 'get-sheet',
          buf: $scope.parser.xls.buf,
          sheetName: this.title
        });
      }
    },
    read: function(buf, file){
      var xls, sec, node, this$ = this;
      xls = $scope.parser.xls;
      xls.sheets.title = null;
      xls.buf = buf;
      if (file.name && !/\.xlsx?/.exec(file.name)) {
        alert("it's not a Microsoft Excel file");
        return;
      }
      eventBus.fire('loading.dimmer.on', 1);
      xls.sec = sec = buf.length * 2.5 / 1000;
      $scope.parser.progress(sec);
      if (!xls.worker) {
        xls.worker = new Worker('/js/data/worker/excel.js');
        xls.worker.onmessage = function(e){
          return $scope.$apply(function(){
            var data;
            if (e.data.type === 'sheet-list') {
              xls.sheets.toggle(true);
              xls.sheets.list = e.data.data;
              eventBus.fire('loading.dimmer.off');
            }
            if (e.data.type === 'sheet') {
              $scope.grid.empty(false);
              data = e.data.data;
              return $scope.grid.load(data, buf.length).then(function(){
                eventBus.fire('loading.dimmer.off');
                return $scope.dataset.clear();
              });
            }
          });
        };
      }
      node = document.getElementById('dataset-import-dropdown') || document.getElementById('dataset-import-dropdown-inline');
      node.className = node.className.replace(/open/, '');
      return $timeout(function(){
        return xls.worker.postMessage({
          type: 'get-sheet-list',
          buf: buf
        });
      }, 100);
    }
  };
  $scope.parser.gsheet = initWrap({
    url: null,
    apiKey: 'AIzaSyD3emlU63t6e_0n9Zj9lFCl-Rwod0OMTqY',
    clientId: '1003996266757-4gv30no8ije0sd8d8qsd709dluav0676.apps.googleusercontent.com',
    scopes: ['profile', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'].join(' '),
    init: function(){
      var this$ = this;
      if (typeof gapi == 'undefined' || gapi === null) {
        return;
      }
      return gapi.load('client:auth2', function(){
        gapi.client.load('drive', 'v3');
        gapi.client.setApiKey(this$.apiKey);
        gapi.auth2.init({
          client_id: this$.clientId,
          scope: this$.scopes
        });
        Paging.loadOnScroll(function(){
          return $scope.parser.gsheet.list();
        }, '#gsheet-list-end', '#gsheet-files');
        return $scope.$watch('parser.gsheet.title', function(n, o){
          if (n !== o) {
            return this$.list(true);
          }
        });
      });
    },
    files: [],
    auth: function(){
      var auth;
      if (typeof gapi == 'undefined' || gapi === null) {
        return;
      }
      auth = gapi.auth2.getAuthInstance();
      if (auth.isSignedIn.get()) {
        return auth;
      } else {
        eventBus.fire('loading.dimmer.on');
        return auth.signIn();
      }
    },
    list: function(flush){
      var this$ = this;
      flush == null && (flush = false);
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
          q: "mimeType='application/vnd.google-apps.spreadsheet'" + (this$.title ? " and name contains '" + this$.title + "'" : '')
        };
        if (this$.pageToken) {
          config.pageToken = this$.pageToken;
        }
        request = gapi.client.drive.files.list(config);
        return request.execute(function(ret){
          if (flush) {
            this$.files = [];
          }
          this$.pageToken = ret.nextPageToken;
          return $scope.$apply(function(){
            this$.files = this$.files.concat((ret.files || (ret.files = [])).map(function(it){
              return {
                file: it
              };
            }));
            return this$.loading = false;
          });
        });
      });
    },
    toggle: function(it){
      this.toggled = it != null
        ? it
        : !this.toggled;
      if (this.toggled && !this.files.length) {
        return this.list();
      }
    },
    sheets: {
      toggled: false,
      toggle: function(it){
        var res;
        this.toggled = it != null
          ? it
          : !this.toggled;
        if (!this.toggled && this.promise) {
          res = this.promise.res;
          this.promise = null;
          return res();
        }
      },
      list: [],
      title: null,
      promise: null,
      load: function(file){
        var this$ = this;
        return gapi.client.sheets.spreadsheets.get({
          spreadsheetId: file.id
        }).then(function(ret){
          this$.list = ret.result.sheets.map(function(it){
            return it.properties.title;
          });
          if (this$.list.length === 1) {
            this$.title = this$.list[0];
            return Promise.resolve();
          }
          eventBus.fire('loading.dimmer.off');
          $scope.parser.gsheet.toggle(false);
          this$.toggle(true);
          return new Promise(function(res, rej){
            return this$.promise = {
              res: res,
              rej: rej
            };
          });
        });
      }
    },
    load: function(file){
      var this$ = this;
      file = file.file;
      eventBus.fire('loading.dimmer.on', 1);
      $scope.parser.progress(3000);
      return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(function(){
        return $scope.parser.gsheet.sheets.load(file);
      }).then(function(){
        return this$.toggle(false);
      }).then(function(){
        eventBus.fire('loading.dimmer.on', 1);
        $scope.parser.progress(3000);
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: file.id,
          range: this$.sheets.title + "!A:ZZ"
        });
      }).then(function(ret){
        var list, head, data, size;
        list = ret.result.values;
        list = list.filter(function(it){
          return it.filter(function(it){
            return (it || "").trim().length;
          }).length;
        });
        head = list.splice(0, 1)[0];
        $scope.grid.empty(false);
        data = {};
        data.headers = head;
        data.rows = list;
        data.types = plotdb.Types.resolve(data);
        size = (ret.body || "").length;
        return $scope.grid.load(data, size).then(function(){
          this$.toggled = false;
          eventBus.fire('loading.dimmer.off');
          return $scope.dataset.clear();
        });
      }, function(){
        var this$ = this;
        return $scope.$apply(function(){
          plNotify.send('danger', "can't load sheet, try again later?");
          return eventBus.fire('loading.dimmer.off');
        });
      });
    }
  });
  return initWrap.run();
}));