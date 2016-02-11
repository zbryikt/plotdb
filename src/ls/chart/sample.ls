angular.module \plotDB
  ..service \sampleChart, <[$rootScope]> ++ ($rootScope) ->
    ret = do
      doc: do
        content: ""
      style: do
        content: ""
      code: do
        content: """
module = {};
module.exports = plotdb.chart.create({
  sample: [0,1,2,3,4,5,6,7,8,9].map(function(it){return {value: it};}),
  dimension: {
    value: { type: [plotdb.Number], require: true, desc: "size of circle" },
    name: { type: [], require: false, desc: "tag of circle" }
  },
  config: {
    padding: { type: [plotdb.Number], default: 10, rebindOnChange: true }
  },
  init: function() {
    this.svg = d3.select(this.root).append("svg").attr({
      width: "100%", height: "100%",
      viewBox: "0 0 800 600",
      preserveAspectRatio: "xMidYMid"
    });
  },
  bind: function() {
    this.data = {children: this.data}
    var bubble = d3.layout.pack().padding(this.config.padding).size([800,600]);
    var nodes = bubble.nodes(this.data).filter(function(it){ return it.parent; });
    var circles = this.svg.selectAll("circle").data(nodes);
    circles.enter().append("circle");
    circles.exit().remove();
  },
  resize: function() {
  },
  render: function() {
    this.svg.selectAll("circle").attr({
      cx: function(it) { return it.x; },
      cy: function(it) { return it.y; },
      r:  function(it) { return it.r; },
      fill: "\#ccc",
      stroke: "\#444"
    });
  }
});
"""

