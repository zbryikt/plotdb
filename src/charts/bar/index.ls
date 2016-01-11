module = export: plotdb.chart.create do
  name: \bar
  title: "Bar Chart"
  desc: "..."
  author: "Kirby Wu"
  sample: [
    * value: 1, text: 1, name: "IE"
    * value: 7, text: 7, name: "Chrome"
    * value: 5, text: 5, name: "Firefox"
    * value: 2, text: 2, name: "Opera"
    * value: 4, text: 4, name: "Android"
    * value: 2, text: 2, name: "Safari"
    * value: 1, text: 1, name: "Puffin"
  ]
  mapping: do
    value: type: [plotdb.Number], require: true
    name: type: [], require: false
    text: type: [], require: false
  config:
    padding: type: [plotdb.Number, plotdb.Percent], default: 10
    margin: type: [plotdb.Number, plotdb.Percent], default: 10
    radius: type: [plotdb.Number], default: 5
    palette: type: [plotdb.Palette], default: plotdb.Palette.default
    font-size: type: [plotdb.Number], default: 12
    direction: type: [plotdb.Choice(<[Vertical Horizontal]>)], default: \Vertical
    show-label: type: [plotdb.Boolean], default: true
    show-axis: type: [plotdb.Boolean], default: true
    axis-size: type: [plotdb.Number], default: 10
  bind: (root, data, config) ->
    @svg = d3.select root .append \svg .attr width: \100%, height: \100%
    @svg.selectAll \rect.bar .data data
      ..enter!append \rect .attr class: \bar
      ..exit!remove!
    @svg.selectAll \text.name .data data
      ..enter!append \text .attr class: \name
      ..exit!remove!
    @svg.selectAll \text.label .data data
      ..enter!append \text .attr class: \label
      ..exit!remove!
    @axis-group = @svg.append \g
    @axis-line = @axis-group.append \line
  resize: (root, data, config) ->
    @color = d3.scale.ordinal!range config.palette
    dir = config.direction == \Vertical
    axis = if config.value-axis => config.axis-size else 0
    [w,h] = [$(root).width!, $(root).height!]
    [m,p,f] = [config.margin, config.padding, config.font-size]
    @svg.attr width: w, height: h, "viewBox": "0 0 #w #h"

    @size = if dir => [w,h] else [h,w]
    if plotdb.Percent.test(p) => p = @size.0 * (+p.replace(/%/,"")/100)
    @padding = p
    @dim = [
      [m + (if dir => axis else 0), @size.0 - m - (if !dir => axis else 0)]
      [
        [m,
         (if dir and config.show-label => config.font-size else 0)
         (if !dir => f * 5 else 0),
        ].reduce(((a,b)->a + b), 0),
        @size.1 - m - (if dir or (!dir and config.show-label) => f else 0)
      ]
    ]
    @len = [
      (( @dim.0.1 - @dim.0.0 ) / data.length) - p,
      d3.scale.linear!domain([0, d3.max(data.map(->it.value))]).range([0, @dim.1.1 - @dim.1.0]),
      d3.scale.linear!domain([0,d3.max(data.map(->it.value))]).range([@dim.1.1 - @dim.1.0, 0])
    ]
    @origin = [
      ((d,i) ~> ( @len.0 + p ) * i + ( p / 2 ) + (if dir => axis else 0 ) + m),
      if dir => ( (d,i) ~> @dim.1.1 - @len.1(d.value) )
      else => @dim.1.0
    ]
    @axis-func = d3.svg.axis!orient (if dir => \left else \bottom) 
      .scale if dir => @len.2 else @len.1
      .tick-padding 3
      .tick-size 0,1

  render: (root, data, config) ->
    dir = config.direction == \Vertical
    name = if dir => <[x y width height dx dy]> else <[y x height width dy dx]>
    @svg.selectAll \rect.bar
      ..attr do
        "#{name.0}": @origin.0
        "#{name.1}": @origin.1
        "#{name.2}": @len.0
        "#{name.3}": ~> @len.1 it.value
        rx: config.radius
        ry: config.radius
        fill: (d,i) ~> @color i
        stroke: \none
 
    @svg.selectAll \text.name
      ..attr do
        "#{name.0}": @origin.0
        "#{name.1}": @origin.1
        "#{name.4}": ~> @len.0 / 2
        "#{name.5}": ~> if dir => @len.1(it.value) + config.font-size else -config.font-size
        "font-size": config.font-size
        "text-anchor": if dir => \middle else \end
        "dominant-baseline": \central
      ..text (d,i) -> d.name

    @svg.selectAll \text.label
      ..attr do
        "#{name.0}": @origin.0
        "#{name.1}": @origin.1
        "#{name.4}": @len.0 / 2
        "#{name.5}": ~> if dir => -config.font-size else @len.1(it.value) + config.font-size
        "font-size": config.font-size
        "text-anchor": if dir => \middle else \start
        "dominant-baseline": \central
      ..text (d,i) -> if config.show-label => d.value else ""

    @axis-group 
      ..attr do
        "transform": ~>
          if dir => "translate(#{@dim.0.0},#{@dim.1.0})" 
          else "translate(#{@dim.1.0},#{@dim.0.1})" 
      ..call @axis-func if config.value-axis
