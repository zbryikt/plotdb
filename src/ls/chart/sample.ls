angular.module \plotDB
  ..service \sampleChart, <[$rootScope]> ++ ($rootScope) ->
    ret = [
      {
        name: "Empty Chart", description: "a boilerplate for visualization"
        permission: {}
        key: 1
        owner: null
        _type: location: \sample, name: \cahrt
        config: { padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: false}}
        dimension: {value: {type: [plotdb.Number], require: true, desc: "" }}
        assets: []
        library: ["d3/3.5.12/min", "plotd3/0.1.0"]
        doc: content: ""
        style: content: ""
        code: content: '''
var module = {};
module.exports = plotdb.chart.create({
  sample: function() {
    return {
      value: [{name: "Value", data: [1,2,3,4,5]}]
    };
  },
  dimension: {
    value: { type: [plotdb.Number], require: true, desc: "" }
  },
  config: {
    /* you can write with a complete spec */
    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: false },
    /* .. or leave fields empty to inherit from default values */
    margin: { },
    fontSize: { }
  },
  init: function() {
    var that = this;
    this.svg = d3.select(this.root).append("svg");
  },
  parse: function() {
    var that = this;
  },
  bind: function() {
    var that = this;
  },
  resize: function() {
    var that = this;
    var box = this.root.getBoundingClientRect();
    var width = this.width = box.width;
    var height = this.height = box.height;
    this.svg.attr({
      width: width + "px", height: height + "px",
      viewBox: [0,0,width,height].join(" "),
      preserveAspectRatio: "xMidYMid"
    });
  },
  render: function() {
    var that = this;
  }
});
'''

      },
      {
        name: "Bubble Chart", description: "a simple bubble chart"
        permission: {}
        key: 2
        owner: null
        _type: location: \sample, name: \cahrt
        config: {
          padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: true},
          palette: { name: "Palette", type: [plotdb.Palette], default: plotdb.Palette.default}
        },
        dimension: {
          value: {type: [plotdb.Number], require: true, desc: "size of circle" },
          name: {type: [], require: false, desc: "tag of circle" },
        }
        assets: []
        doc: do
          content: """<h3>D3.js Pack Layout Example</h3>"""
        style: do
          content:'''
svg, body {
  background: #fff;
}
svg, body, text {
  font-family: arial;
  color: #222;
  fill: #222;
  font-size: 12px;
}
text {
  text-anchor: middle;
  dominant-baseline: central;
}
circle, rect, path {
  fill: #eee;
  stroke: #555;
  stroke-width: 2;
}
h3 {
  text-align: center;
  font-family: Arial;
}
'''
      code: do
        content: '''
var module = {};
module.exports = plotdb.chart.create({
  sample: [
    {value: 3, name: "Allen"},
    {value: 1, name: "Bob"},
    {value: 4, name: "Cindy"},
    {value: 1, name: "David"},
    {value: 5, name: "Eva"},
    {value: 9, name: "Frank"},
    {value: 2, name: "Gill"},
    {value: 6, name: "Hilbert"},
    {value: 7, name: "James"}
  ],
  dimension: {
    value: { type: [plotdb.Number], require: true, desc: "size of circle" },
    name: { type: [], require: false, desc: "tag of circle" }
  },
  config: {
    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: true },
    palette: { name: "Palette", type: [plotdb.Palette], default: plotdb.Palette.default }
  },
  init: function() {
    this.svg = d3.select(this.root).append("svg");
  },
  bind: function() {
    this.resize();
    this.circles = this.svg.selectAll("circle").data(this.nodes);
    this.circles.enter().append("circle");
    this.texts = this.svg.selectAll("text").data(this.nodes);
    this.texts.enter().append("text");
  },
  resize: function() {
    var box = this.root.getBoundingClientRect();
    var width = box.width;
    var height = box.height - 100;
    this.svg.attr({
      width: width + "px", height: height + "px",
      viewBox: [0,0,width,height].join(" "),
      preserveAspectRatio: "xMidYMid"
    });
    this.bubble = d3.layout.pack().padding(this.config.padding).size([width,height]);
    this.nodes = this.bubble.nodes({children: this.data}).filter(function(it) { return it.depth; });
    this.colors = d3.scale.ordinal().range(
      this.config.palette.colors.map(function(it) { return it.hex; })
    );
  },
  render: function() {
    var that = this;
    this.circles.attr({
      cx: function(it) { return it.x; },
      cy: function(it) { return it.y; },
      r:  function(it) { return it.r; }
    }).style({
      stroke: function(it) { return that.colors(it.name); }
    });
    this.texts.attr({
      x: function(it) { return it.x; },
      y: function(it) { return it.y; }
    }).text(function(it) { return it.name; });
  }
});

'''
      }
    ]
