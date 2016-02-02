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
  name: "New Chart",
  title: "New Chart",
  desc: "No Description",
  author: "Your Name",
  sample: [0,1,2,3,4,5,6,7,8,9].map(function(it){return {value: it};}),
  dimension: {
    value: { type: [plotdb.Number], require: true, desc: "size of circle" },
    name: { type: [], require: false, desc: "tag of circle" }
  },
  config: {
    padding: { type: [plotdb.Number], default: 10, rebindOnChange: true }
  },
  bind: function(root, data, config) {
    this.svg = d3.select(root).append("svg").attr({
      width: "100%",
      height: "100%",
      viewBox: "0 0 800 600",
      preserveAspectRatio: "xMidYMid"
    });

    if(!data || !data.length)
      data = {children: this.sample};
    else
      data = {children: data}
    var bubble = d3.layout.pack();
    bubble.padding(config.padding).size([800,600]);
    nodes = bubble.nodes(data);
    nodes = nodes.filter(function(it){ return it.parent; });

    var circles = this.svg.selectAll("circle").data(nodes);
    circles.enter().append("circle");
    circles.exit().remove();
  },
  resize: function(root, data, config) {
  },
  render: function(root, data, config) {
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

