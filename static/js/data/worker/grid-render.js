// Generated by LiveScript 1.3.1
var gridRender;
gridRender = function(e){
  var htmlCharMap, escape, data, dimkeys, bind, rowcount, types, ohlen, rlen, len, ref$, headers, res$, i$, to$, i, w, ths, j, trs, dim;
  htmlCharMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  escape = function(text){
    text == null && (text = "");
    return (text + "").replace(/[&<>"']/g, function(m){
      return htmlCharMap[m];
    });
  };
  data = e.data;
  dimkeys = data.dimkeys || [];
  bind = data.bind || [];
  rowcount = data.rowcount || 10;
  types = data.types || [];
  ohlen = data.headers.length;
  rlen = {
    head: data.headers.length,
    rows: (data.rows || (data.rows = [])).length
  };
  len = {
    head: data.headers.length < rowcount
      ? rowcount
      : data.headers.length + 1,
    rows: (data.rows || (data.rows = [])).length < 100
      ? 100
      : ((ref$ = data.rows).length || (ref$.length = [])) + 10
  };
  res$ = [];
  for (i$ = 0, to$ = len.head; i$ < to$; ++i$) {
    i = i$;
    res$.push(data.headers[i] || '');
  }
  headers = res$;
  w = 100 / len.head + "%";
  if (len.head > 7) {
    w = "15%";
  }
  ths = "<div>" + headers.map(function(d, i){
    var that;
    return ["<div style='width:" + w + "' col='" + i + "'>", "<textarea col='" + i + "' class='" + (i < ohlen ? 'in-use' : '') + "'>" + d + "</textarea>", "<small class='grayed' col='" + i + "'>&nbsp;", i < ohlen ? (that = types[i]) ? that : 'ANY' : '', "</small>", i < ohlen ? "<div class='closebtn inverse' col='" + i + "'></div>" : '', "</div>"].join("");
  }).join("") + "</div>";
  if (!data.rows) {
    return postMessage({
      ths: ths
    });
  }
  res$ = [];
  for (i$ = 0, to$ = rlen.rows; i$ < to$; ++i$) {
    i = i$;
    res$.push(data.rows[i] || (fn$()));
  }
  data.rows = res$;
  trs = [];
  dim = "<div>" + headers.map(function(d, j){
    var v;
    return [
      "<div class='dropdown' col='" + j + "' style='width:" + w + "'>", "<div class='dropdown-toggle' data-toggle='dropdown'>", "<span>" + (bind[j] || '<span class="grayed">(empty)</span>') + "</span>", "<span class='caret'></span></div>", "<ul class='dropdown-menu'>", (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = dimkeys).length; i$ < len$; ++i$) {
          v = ref$[i$];
          results$.push(("<li><a href='#' data-dim=\"" + v.name + "\" ") + ("data-multi=\"" + !!v.multiple + "\">" + v.name + "</a></li>"));
        }
        return results$;
      }()).join(""), "<li class='grayed'><a href='#' data-dim=\"\">(empty)</a></li>", "</ul>", "</div>"
    ].join("");
  }).join("") + "</div>";
  for (i$ = 0, to$ = len.rows; i$ < to$; ++i$) {
    i = i$;
    trs.push(("<div><span class='closebtn inverse' row='" + i + "'></span>") + headers.map(fn1$).join("") + "</div>");
  }
  return {
    trs: trs,
    ths: ths,
    dim: dim
  };
  function fn$(){
    var i$, to$, results$ = [];
    for (i$ = 0, to$ = rlen.head; i$ < to$; ++i$) {
      j = i$;
      results$.push('');
    }
    return results$;
  }
  function fn1$(d, j){
    return ["<div style='width:" + w + "'><textarea row='" + i + "' col='" + j + "'>" + ((data.rows[i] || [])[j] || '') + "</textarea></div>"].join("");
  }
};