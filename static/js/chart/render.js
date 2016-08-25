// Generated by LiveScript 1.3.1
var plotdbDomain, brandNew;
plotdbDomain = window.plConfig.urlschema + "" + window.plConfig.domain;
brandNew = true;
window.addEventListener('click', function(){
  return window.parent.postMessage({
    type: 'click',
    payload: ""
  }, plotdbDomain);
});
window.thread = {
  count: 0,
  inc: function(t){
    if (t) {
      return this.count = (this.count || 0) + 1;
    }
  },
  dec: function(t){
    if (t) {
      return this.count = (this.count || 1) - 1;
    }
  },
  racing: function(){
    return this.count > 1;
  }
};
$(document).ready(function(){
  var dispatcher, loadscript, loadlib, properEval, errorHandling, colorblind, configPreset, parse, snapshot, render, resizeHandler;
  dispatcher = function(evt){
    var ref$;
    if ((ref$ = evt.data.type) === 'snapshot' || ref$ === 'getsvg' || ref$ === 'getpng') {
      return snapshot(evt.data.type);
    } else if (evt.data.type === 'render') {
      return render(evt.data.payload, evt.data.rebind);
    } else if (evt.data.type === 'get-sample-data') {
      return window.parent.postMessage({
        type: 'get-sample-data',
        data: window.sampleData || null
      }, plotdbDomain);
    } else if (evt.data.type === 'parse-chart') {
      return parse(evt.data.payload, 'chart');
    } else if (evt.data.type === 'parse-theme') {
      return parse(evt.data.payload, 'theme');
    } else if (evt.data.type === 'reload') {
      if (!brandNew) {
        return window.location.reload();
      } else {
        return window.parent.postMessage({
          type: 'loaded'
        }, plotdbDomain);
      }
    } else if (evt.data.type === 'colorblind-emu') {
      return colorblind(evt.data.payload);
    } else if (evt.data.type === 'edit') {
      return edit(evt.data.payload);
    }
  };
  window.addEventListener('error', function(e){
    var reBloburl, stack, msg;
    reBloburl = /blobhttp:%3A\/\/[^:]+:/;
    stack = e.error.stack;
    if (reBloburl.exec(stack)) {
      stack = stack.split(reBloburl).join("line ");
      msg = e.message + " at line " + (e.lineno - 1) + ".";
      if (e.message.indexOf(stack) < 0) {
        msg += " Callstack: \n" + stack;
      }
    } else {
      msg = e.message + " at line " + (e.lineno - 1) + ".";
    }
    return errorHandling(msg, e.lineno - 1);
  });
  loadscript = function(lib, url){
    return new Promise(function(res, rej){
      var x$, node;
      x$ = node = document.createElement('script');
      x$.type = 'text/javascript';
      x$.src = url;
      x$.onload = function(){
        return res(lib);
      };
      return document.head.appendChild(node);
    });
  };
  loadlib = function(payload){
    var head, moduleBackup, k, promise, lib, url;
    head = document.getElementsByTagName("head")[0];
    moduleBackup = window.module;
    delete window.module;
    if (!(function(){
      var results$ = [];
      for (k in payload.library || {}) {
        results$.push(k);
      }
      return results$;
    }()).length) {
      payload.library['legacy/0.0.1'] = plotdbDomain + "/js/pack/legacy.js";
    }
    promise = Promise.each((function(){
      var ref$, results$ = [];
      for (lib in ref$ = payload.library) {
        url = ref$[lib];
        results$.push({
          lib: lib,
          url: url
        });
      }
      return results$;
    }()), function(d){
      return loadscript(d.lib, d.url);
    }).then(function(){
      return window.module = moduleBackup;
    });
    return promise;
  };
  properEval = function(code, updateModule){
    updateModule == null && (updateModule = true);
    return new Promise(function(res, rej){
      var empty, module, codeURL, codeNode;
      empty = "{exports:{init:function(){},update:function(){},resize:function(){},bind:function(){},render:function(){}}}";
      window.errorMessage = "";
      module = updateModule ? 'module' : 'moduleLocal';
      code = "(function() { " + code + "; window." + module + " = (typeof(module)=='undefined'?" + empty + ":module); })()";
      window.codeURL = codeURL = URL.createObjectURL(new Blob([code], {
        type: "text/javascript"
      }));
      codeNode = document.createElement("script");
      codeNode.onload = function(){
        var e;
        URL.revokeObjectURL(codeURL);
        if (window[module]) {
          window[module].identity = parseInt(Math.random() * 1000);
        }
        res(window[module]);
        try {
          return document.body.removeChild(codeNode);
        } catch (e$) {
          return e = e$;
        }
      };
      codeNode.src = codeURL;
      return document.body.appendChild(codeNode);
    });
  };
  errorHandling = function(e, lineno){
    var msg, reBloburl, ret, lines;
    lineno == null && (lineno = 0);
    if (!e) {
      msg = "plot failed with unknown error";
    } else if (typeof e !== typeof {}) {
      msg = e + "";
    } else if (!e.stack) {
      msg = e.toString();
    } else {
      msg = e.stack;
    }
    reBloburl = /blob:http%3A\/\/[^:]+:/;
    if (reBloburl.exec(msg)) {
      msg = msg.split(reBloburl).join("line ");
    }
    if (!lineno) {
      ret = /line (\d+):\d+/.exec(msg);
      lineno = ret ? parseInt(ret[1]) : 0;
    }
    if (msg.length > 1024) {
      msg = msg.substring(0, 1024) + "...";
    }
    lines = msg.split('\n');
    if (lines.length > 4) {
      msg = lines.splice(0, 4).join('\n');
    }
    return window.parent.postMessage({
      type: 'error',
      payload: {
        msg: msg,
        lineno: lineno
      }
    }, plotdbDomain);
  };
  colorblind = function(payload){
    var val;
    val = ['normal', 'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly', 'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly'];
    if (!in$(payload, val)) {
      payload = 'normal';
    }
    return d3.select('body').style({
      "-webkit-filter": "url('#" + payload + "')",
      "filter": "url('#" + payload + "')"
    });
  };
  configPreset = function(config){
    var k, ref$, v, lresult$, p, field, ref1$, value, results$ = [];
    for (k in ref$ = config || {}) {
      v = ref$[k];
      lresult$ = [];
      p = plotdb.config[k]
        ? k
        : plotdb.config[v.extend] ? v.extend : null;
      if (!p) {
        continue;
      }
      for (field in ref1$ = plotdb.config[p]) {
        value = ref1$[field];
        if (!(v[field] != null)) {
          lresult$.push(v[field] = value);
        }
      }
      results$.push(lresult$);
    }
    return results$;
  };
  parse = function(payload, type){
    return loadlib(payload).then(function(){
      var code, e;
      try {
        code = payload.code;
        if (type === 'chart') {
          return properEval(code, false).then(function(module){
            var chart, payload, ref$;
            chart = module.exports;
            configPreset(chart.config);
            payload = JSON.stringify((ref$ = {}, ref$.dimension = chart.dimension, ref$.config = chart.config, ref$));
            return window.parent.postMessage({
              type: 'parse-chart',
              payload: payload
            }, plotdbDomain);
          });
        } else if (type === 'theme') {
          return properEval(code, false).then(function(module){
            var theme, payload, ref$;
            theme = module.exports;
            payload = JSON.stringify((ref$ = {}, ref$.typedef = theme.typedef, ref$.config = theme.config, ref$));
            return window.parent.postMessage({
              type: 'parse-theme',
              payload: payload
            }, plotdbDomain);
          });
        }
      } catch (e$) {
        e = e$;
        return errorHandling(e);
      }
    });
  };
  snapshot = function(type){
    var svgnode, styles, i$, to$, idx, style, ref$, width, height, svg, img, encoded, e;
    type == null && (type = 'snapshot');
    try {
      d3.selectAll('#container svg').each(function(){
        var ref$, width, height;
        ref$ = this.getBoundingClientRect(), width = ref$.width, height = ref$.height;
        return d3.select(this).attr({
          "xmlns": "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "width": width,
          "height": height
        });
      });
      svgnode = document.querySelector('#container svg');
      styles = svgnode.querySelectorAll("style");
      for (i$ = 0, to$ = styles.length; i$ < to$; ++i$) {
        idx = i$;
        style = styles[idx];
        if (!style.generated) {
          continue;
        }
        svgnode.removeChild(style);
      }
      styles = document.querySelectorAll('html style');
      for (i$ = styles.length - 1; i$ >= 0; --i$) {
        idx = i$;
        style = styles[idx].cloneNode(true);
        style.generated = true;
        svgnode.insertBefore(style, svgnode.childNodes[0]);
      }
      ref$ = svgnode.getBoundingClientRect(), width = ref$.width, height = ref$.height;
      svg = svgnode.outerHTML;
      if (type === 'getsvg') {
        return window.parent.postMessage({
          type: 'getsvg',
          payload: svg
        }, plotdbDomain);
      }
      img = new Image();
      img.onload = function(){
        var canvas, ref$;
        canvas = (ref$ = document.createElement("canvas"), ref$.width = width, ref$.height = height, ref$);
        canvas.getContext('2d').drawImage(img, 0, 0, width, height, 0, 0, width, height);
        return window.parent.postMessage({
          type: type,
          payload: canvas.toDataURL()
        }, plotdbDomain);
      };
      encoded = base64.encode(utf8.encode(svg));
      return img.src = "data:image/svg+xml;charset=utf-8;base64," + encoded;
    } catch (e$) {
      e = e$;
      console.log(e);
      return window.parent.postMessage({
        type: type,
        payload: null
      }, plotdbDomain);
    }
  };
  render = function(payload, rebind){
    var ref$, code, style, doc, data, assets, dimension, config, theme, reboot, ret, node, promise, e;
    rebind == null && (rebind = true);
    ref$ = ['code', 'style', 'doc'].map(function(it){
      return (payload.chart || (payload.chart = {}))[it].content;
    }), code = ref$[0], style = ref$[1], doc = ref$[2];
    ref$ = ['data', 'assets'].map(function(it){
      return payload.chart[it];
    }), data = ref$[0], assets = ref$[1];
    dimension = payload.chart.dimension || {};
    config = payload.chart.config || {};
    theme = payload.theme || {};
    reboot = !window.module || !window.module.inited || window.module.execError;
    if (reboot) {
      sched.clear();
    }
    thread.inc(reboot);
    try {
      if (false && "script tag disallow") {
        ret = /<\s*script[^>]*>.*<\s*\/\s*script\s*>/g.exec(doc.toLowerCase());
        if (ret) {
          throw new Error("script tag is not allowed in document.");
        }
      }
      if (reboot) {
        node = document.getElementById("wrapper");
        if (!node) {
          node = document.createElement("div");
          node.setAttribute("id", "wrapper");
          node.setAttribute("class", "pdb-root");
          document.body.appendChild(node);
        }
        $(node).html(["<style type='text/css'>/* <![CDATA[ */" + style + "/* ]]> */</style>", (theme.style || (theme.style = {})).content ? "<style type='text/css'>/* <![CDATA[ */" + theme.style.content + "/* ]]> */</style>" : void 8, "<div id='container' style='position:relative;width:100%;height:100%;'>", "<div style='height:0'>&nbsp;</div>", doc, (theme.doc || (theme.doc = {})).content ? theme.doc.content : void 8, "</div>"].join(""));
        promise = loadlib(payload).then(function(){
          return properEval(code);
        });
      } else {
        promise = Promise.resolve(window.module);
      }
      promise.then(function(module){
        var root, chart, k, ref$, v, i$, ref1$, len$, type, e, assetsmap, file, raw, array, j$, to$, idx, promise, this$ = this;
        if (thread.racing()) {
          return thread.dec(reboot);
        }
        root = document.getElementById('container');
        chart = module.exports;
        if (chart.sample) {
          window.sampleData = plotdb.chart.getSampleData(chart, dimension);
          if (!data || !data.length) {
            data = window.sampleData;
          }
        }
        configPreset(config);
        for (k in ref$ = config || {}) {
          v = ref$[k];
          for (i$ = 0, len$ = (ref1$ = v.type || []).length; i$ < len$; ++i$) {
            type = ref1$[i$];
            try {
              type = plotdb[type.name];
              if (type.test && type.parse && type.test(v.value)) {
                v.value = type.parse(v.value);
                break;
              }
            } catch (e$) {
              e = e$;
              console.log("chart config: type parsing exception ( " + k + " / " + type + " )");
              console.log(e.stack + "");
              thread.dec(reboot);
              return errorHandling("Exception parsing chart config '" + k + "'");
            }
          }
        }
        for (k in ref$ = chart.config) {
          v = ref$[k];
          if (!(config[k] != null) || !(config[k].value != null)) {
            config[k] = (v || config[k] || {})['default'] || 0;
          } else {
            config[k] = config[k].value;
          }
        }
        chart.assets = assetsmap = {};
        for (i$ = 0, len$ = (ref$ = assets).length; i$ < len$; ++i$) {
          file = ref$[i$];
          raw = atob(file.content);
          array = new Uint8Array(raw.length);
          for (j$ = 0, to$ = raw.length; j$ < to$; ++j$) {
            idx = j$;
            array[idx] = raw.charCodeAt(idx);
          }
          file.blob = new Blob([array], {
            type: file.type
          });
          file.url = URL.createObjectURL(file.blob);
          file.datauri = ["data:", file.type, ";charset=utf-8;base64,", file.content].join("");
          assetsmap[file.name] = file;
        }
        chart.config = config;
        if (rebind || reboot || !(chart.root && chart.data)) {
          chart.root = root;
          chart.data = data;
          chart.dimension = dimension;
        }
        promise = Promise.resolve();
        if (reboot) {
          promise = promise.then(function(){
            var ret;
            if (thread.racing()) {
              return;
            }
            ret = !module.inited ? (chart.init && chart.init(), chart.parse ? chart.parse() : void 8) : null;
            module.inited = true;
            return ret;
          });
        }
        return promise.then(function(){
          if (thread.racing()) {
            return thread.dec(reboot);
          }
          chart.resize();
          if (rebind || reboot) {
            chart.bind();
          }
          chart.render();
          module.execError = false;
          return window.parent.postMessage({
            type: 'error',
            payload: window.errorMessage || ""
          }, plotdbDomain);
        });
      })['catch'](function(e){
        module.execError = true;
        thread.dec(reboot);
        return errorHandling(e);
      });
    } catch (e$) {
      e = e$;
      thread.dec(reboot);
      errorHandling(e);
    }
    return brandNew = false;
  };
  window.addEventListener('message', dispatcher, false);
  resizeHandler = null;
  window.addEventListener('resize', function(){
    if (resizeHandler) {
      clearTimeout(resizeHandler);
    }
    return resizeHandler = setTimeout(function(){
      var chart;
      resizeHandler = null;
      if (!window.module || !window.module.exports) {
        return;
      }
      chart = window.module.exports;
      chart.resize();
      return chart.render();
    }, 400);
  });
  window.addEventListener('keydown', function(e){
    if ((e.metaKey || e.altKey) && (e.keyCode === 13 || e.which === 13)) {
      return window.parent.postMessage({
        type: 'alt-enter'
      }, plotdbDomain);
    }
  });
  return window.parent.postMessage({
    type: 'loaded'
  }, plotdbDomain);
});
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}