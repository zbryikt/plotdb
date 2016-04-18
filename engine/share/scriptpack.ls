(->
  config = do
    render: 
      <[
        /js/sched.js
        /assets/jquery/1.10.2/jquery.min.js
        /assets/d3js/3.5.12/d3.v3.min.js
        /assets/bluebird/3.3.4/bluebird.min.js
        /assets/topojson/1.6.24/topojson.min.js
        /assets/voronoijs/0.0.1/voronoi.min.js
        /assets/canvg/1.4.0/rgbcolor.js
        /assets/canvg/1.4.0/StackBlur.js
        /assets/canvg/1.4.0/canvg.js
        /assets/utf8js/2.0.0/utf8.js
        /assets/base64/0.1.0/base64.js
        /js/chart/base.js
        /js/share/config.js
        /js/chart/render.js
      ]>


  if module? => module.exports = config
  else if angular? =>
    angular.module \plotDB
      ..service \plScriptPack <[]> ++ -> config
  else window.plConfig = config
)!

