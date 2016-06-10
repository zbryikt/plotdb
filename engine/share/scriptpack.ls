(->
  config = do
    render: 
      <[
        /js/sched.js
        /assets/jquery/1.10.2/jquery.min.js
        /assets/d3js/3.5.12/d3.v3.min.js
        /assets/bluebird/3.3.4/bluebird.min.js
        /assets/topojson/1.6.24/topojson.min.js
        /assets/d3plugin/d3.geo.projection.v0.min.js
        /assets/voronoijs/0.0.1/voronoi.min.js
        /assets/canvg/1.4.0/rgbcolor.js
        /assets/canvg/1.4.0/StackBlur.js
        /assets/canvg/1.4.0/canvg.js
        /assets/utf8js/2.0.0/utf8.js
        /assets/base64/0.1.0/base64.js
        /js/chart/base.js
        /js/share/config.js
        /js/chart/render.js
        /js/chart/plotd3.js
      ]>
    view:
      <[
        /js/sched.js
        /assets/jquery/1.10.2/jquery.min.js
        /assets/d3js/3.5.12/d3.v3.min.js
        /assets/topojson/1.6.24/topojson.min.js
        /assets/d3plugin/d3.geo.projection.v0.min.js
        /assets/voronoijs/0.0.1/voronoi.min.js
        /js/chart/base.js
        /js/share/config.js
        /js/chart/view.js
        /js/chart/plotd3.js
      ]>
    loader:
      <[
        /js/chart/base.js
        /js/share/config.js
        /js/chart/view.js
      ]>
    base:
      <[
        /assets/codemirror/5.10/lib/codemirror.min.js
        /assets/bluebird/3.3.4/bluebird.min.js
        /assets/ldcolorpicker/0.1.1/ldcp.min.js
        /assets/codemirror/5.10/mode/javascript/javascript.js
        /assets/codemirror/5.10/mode/xml/xml.js
        /assets/codemirror/5.10/mode/css/css.js
        /assets/ui-codemirror/0.3.0/ui-codemirror.min.js
        /assets/clipboard/1.3.1/clipboard.min.js
        /assets/ngDraggable/0.1.8/ngDraggable.js
        /assets/utf8js/2.0.0/utf8.js
        /assets/base64/0.1.0/base64.js
        /assets/select2/4.0.1/js/select2.full.min.js
        /assets/voronoijs/0.0.1/voronoi.min.js
        /js/plotdb.js
        /js/share/config.js
        /js/io.js
        /js/utility.js
        /js/editor.js
        /js/data/sample.js
        /js/data/index.js
        /js/chart/base.js
        /js/chart/sample.js
        /js/chart/index.js
        /js/palette/sample.js
        /js/palette/index.js
        /js/theme/sample.js
        /js/theme/index.js
        /js/site.js
        /js/service.js
      ]>

  if module? => module.exports = config
  else if angular? =>
    angular.module \plotDB
      ..service \plScriptPack <[]> ++ -> config
  else window.plConfig = config
)!

