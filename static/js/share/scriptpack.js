// Generated by LiveScript 1.3.1
(function(){
  var config, x$;
  config = {
    css: {
      plotdb: ['/css/render/pdb.css'],
      frameworks: ['/assets/bootstrap/3.3.7/css/bootstrap.min.css', '/assets/fontawesome/4.6.1/css/font-awesome.min.css', '/assets/select2/4.0.1/css/select2.min.css', '/assets/ldcolorpicker/0.1.1/ldcp.css', '/assets/codemirror/5.10/lib/codemirror.css', '/assets/codemirror/5.10/theme/neat.css', '/assets/codemirror/5.10/theme/monokai.css', '/assets/codemirror/5.10/theme/rubyblue.css', '/assets/codemirror/5.10/theme/colorforth.css', '/assets/clusterize/0.16.1/clusterize.css', '/assets/medium-editor/5.15.1/css/medium-editor.min.css', '/assets/medium-insert/2.2.4/css/base.min.css', '/assets/medium-insert/2.2.4/css/frontend.min.css', '/assets/animate.css/3.5.1/index.css', '/css/index.css']
    },
    js: {
      render: ['/js/sched.js', '/assets/jquery/1.10.2/jquery.min.js', '/assets/bluebird/3.3.4/bluebird.min.js', '/assets/canvg/1.4.0/rgbcolor.js', '/assets/canvg/1.4.0/StackBlur.js', '/assets/canvg/1.4.0/canvg.js', '/assets/utf8js/2.0.0/utf8.js', '/assets/base64/0.1.0/base64.js', '/js/plotdb/main.js', '/js/plotdb/type.js', '/js/plotdb/chart.js', '/js/plotdb/theme.js', '/js/plotdb/data.js', '/js/plotdb/config.js', '/js/plotdb/util.js', '/js/share/config.js', '/js/chart/render.js'],
      view: ['/js/plotdb/main.js', '/js/plotdb/type.js', '/js/plotdb/chart.js', '/js/plotdb/theme.js', '/js/plotdb/data.js', '/js/plotdb/config.js', '/js/plotdb/util.js', '/js/share/config.js', '/js/chart/view.js'],
      plotdb: ['/js/plotdb/main.js', '/js/plotdb/type.js', '/js/plotdb/chart.js', '/js/plotdb/theme.js', '/js/plotdb/data.js', '/js/plotdb/config.js', '/js/plotdb/util.js', '/js/share/config.js', '/js/chart/view.js'],
      loader: ['/js/plotdb/main.js', '/js/plotdb/type.js', '/js/plotdb/chart.js', '/js/plotdb/theme.js', '/js/plotdb/data.js', '/js/plotdb/config.js', '/js/plotdb/util.js', '/js/share/config.js', '/js/chart/view.js'],
      base: ['/assets/codemirror/5.10/lib/codemirror.min.js', '/assets/bluebird/3.3.4/bluebird.min.js', '/assets/ldcolorpicker/0.1.1/ldcp.js', '/assets/codemirror/5.10/mode/javascript/javascript.js', '/assets/codemirror/5.10/mode/xml/xml.js', '/assets/codemirror/5.10/mode/css/css.js', '/assets/ui-codemirror/0.3.0/ui-codemirror.min.js', '/assets/clipboard/1.5.16/clipboard.min.js', '/assets/ngDraggable/0.1.8/ngDraggable.js', '/assets/utf8js/2.0.0/utf8.js', '/assets/base64/0.1.0/base64.js', '/assets/select2/4.0.3/js/select2.full.min.js', '/assets/clusterize/0.16.1/clusterize.min.js', '/assets/handlebars/4.0.5/handlebars.runtime.min.js', '/assets/medium-editor/5.15.1/js/medium-editor.min.js', '/assets/medium-insert/2.2.4/js/index.min.js', '/assets/medium-list/1.0.5/medium-editor-list-min.js', '/assets/acorn/4.0.4/acorn.min.js', '/js/plotdb.js', '/js/share/config.js', '/js/io.js', '/js/payment.js', '/js/utility.js', '/js/editor.js', '/js/data/sample.js', '/js/data/index.js', '/js/data/edit.js', '/js/plotdb/main.js', '/js/plotdb/type.js', '/js/plotdb/chart.js', '/js/plotdb/theme.js', '/js/plotdb/data.js', '/js/plotdb/config.js', '/js/plotdb/util.js', '/js/chart/sample.js', '/js/chart/index.js', '/js/palette/sample.js', '/js/palette/index.js', '/js/theme/sample.js', '/js/theme/index.js', '/js/entity/user.js', '/js/entity/team.js', '/js/entity/entity.js', '/js/site.js', '/js/service.js', '/js/select.js', '/js/perm/index.js', '/js/folder/index.js'],
      frameworks: ['/assets/jquery/1.10.2/jquery.min.js', '/assets/d3js/3.5.12/d3.v3.min.js', '/assets/angular/1.3.15/angular.min.js', '/assets/bootstrap/3.3.7/js/bootstrap.min.js'],
      legacy: ['/lib/topojson/1.6.24/index.min.js', '/lib/voronoijs/0.0.1/index.min.js', '/assets/d3js/3.5.12/d3.v3.min.js', '/lib/d3.geo.projection/0.2.16/index.min.js', '/js/chart/plotd3.js', '/js/chart/legacy.js']
    }
  };
  if (typeof module != 'undefined' && module !== null) {
    return module.exports = config;
  } else if (typeof angular != 'undefined' && angular !== null) {
    x$ = angular.module('plotDB');
    x$.service('plScriptPack', [].concat(function(){
      return config;
    }));
    return x$;
  } else {
    return window.plScriptPack = config;
  }
})();