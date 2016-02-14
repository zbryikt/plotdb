angular.module \plotDB
  ..service \sampleChart, <[$rootScope]> ++ ($rootScope) ->
    ret = do
      doc: do
        content: """<h3>D3.js Pack Layout Example</h3>"""
      style: do
        content: """svg {
  background: \#fff;
}
circle {
  fill: \#ccc;
  stroke: \#777;
}

h3 {
  text-align: center;
  font-family: Arial;
}
"""
      code: do
        content: """var module = {};
module.exports = plotdb.chart.create({
  sample: [0,1,2,3,4,5,6,7,8,9].map(function(it){return {value: it};}),
  dimension: {
    value: { type: [plotdb.Number], require: true, desc: "size of circle" },
    name: { type: [], require: false, desc: "tag of circle" }
  },
  config: {
    padding: { name: "padding", type: [plotdb.Number], default: 10, rebindOnChange: true }
  },
  init: function() {
    this.svg = d3.select(this.root).append("svg").attr({
      width: "100%", height: "80%",
      viewBox: "0 0 800 600",
      preserveAspectRatio: "xMidYMid"
    });
  },
  bind: function() {
    this.resize();
    this.circles = this.svg.selectAll("circle").data(this.nodes);
    this.circles.enter().append("circle");
    this.circles.exit().remove();
  },
  resize: function() {
    this.bubble = d3.layout.pack().padding(this.config.padding).size([800,600]);
    this.nodes = this.bubble.nodes({children: this.data}).filter(function(it) { return it.depth; });
  },
  render: function() {
    this.svg.selectAll("circle").attr({
      cx: function(it) { return it.x; },
      cy: function(it) { return it.y; },
      r:  function(it) { return it.r; }
    });
  }
});
"""
