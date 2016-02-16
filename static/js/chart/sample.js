var x$;x$=angular.module("plotDB"),x$.service("sampleChart",["$rootScope"].concat(function(){var n;return n={doc:{content:"<h3>D3.js Pack Layout Example</h3>"},style:{content:" \nsvg, body {\n  background: #fff;\n}\nsvg, body, text {\n  font-family: arial;\n  color: #222;\n  fill: #222;\n  font-size: 12px;\n}\ntext {\n  text-anchor: middle;\n  dominant-baseline: central;\n}\ncircle, rect, path {\n  fill: #eee;\n  stroke: #555;\n  stroke-width: 2;\n}\nh3 {\n  text-align: center;\n  font-family: Arial;\n}"},code:{content:'var module = {};\nmodule.exports = plotdb.chart.create({\n  sample: [\n    {value: 3, name: "Allen"},\n    {value: 1, name: "Bob"},\n    {value: 4, name: "Cindy"},\n    {value: 1, name: "David"},\n    {value: 5, name: "Eva"},\n    {value: 9, name: "Frank"},\n    {value: 2, name: "Gill"},\n    {value: 6, name: "Hilbert"},\n    {value: 7, name: "James"}\n  ],\n  dimension: {\n    value: { type: [plotdb.Number], require: true, desc: "size of circle" },\n    name: { type: [], require: false, desc: "tag of circle" }\n  },\n  config: {\n    padding: { name: "Padding", type: [plotdb.Number], default: 10, rebindOnChange: true },\n    palette: { name: "Palette", type: [plotdb.Palette], default: plotdb.Palette.default }\n  },\n  init: function() {\n    this.svg = d3.select(this.root).append("svg");\n  },\n  bind: function() {\n    this.resize();\n    this.circles = this.svg.selectAll("circle").data(this.nodes);\n    this.circles.enter().append("circle");\n    this.texts = this.svg.selectAll("text").data(this.nodes);\n    this.texts.enter().append("text");\n  },\n  resize: function() {\n    var box = this.root.getBoundingClientRect();\n    var width = box.width;\n    var height = box.height - 100;\n    this.svg.attr({\n      width: width + "px", height: height + "px",\n      viewBox: [0,0,width,height].join(" "),\n      preserveAspectRatio: "xMidYMid"\n    });\n    this.bubble = d3.layout.pack().padding(this.config.padding).size([width,height]);\n    this.nodes = this.bubble.nodes({children: this.data}).filter(function(it) { return it.depth; });\n    this.colors = d3.scale.ordinal().range(\n      this.config.palette.colors.map(function(it) { return it.hex; })\n    );\n  },\n  render: function() {\n    var that = this;\n    this.circles.attr({\n      cx: function(it) { return it.x; },\n      cy: function(it) { return it.y; },\n      r:  function(it) { return it.r; }\n    }).style({\n      stroke: function(it) { return that.colors(it.name); }\n    });\n    this.texts.attr({\n      x: function(it) { return it.x; },\n      y: function(it) { return it.y; }\n    }).text(function(it) { return it.name; });\n  }\n});'}}}));