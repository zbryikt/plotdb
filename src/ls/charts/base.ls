/*
plotdb = {}
plotdb.chart = do
  corelib: {}
  create: (config) ->
    {} <<< @base <<< config
  base: do
    name: \base
    title: 'chart template'
    desc: null
    mapping: do
      value: {type: [], require: false}
    config: do
      width: {type: [], default: 800}
      height: {type: [], default: 600}
    init:   (data, map, config) ->
      @bind data, map, config
      @render config
    bind:   (data, map, config) ->
    render: (data, map, config) ->

plotdb.chart.corelib.linechart = plotdb.chart.base.create do
  name: \LINE
  title: 'Line Chart'
  mapping: do
    value: {type: [], require: true}
    label: {type: [], require: false}
  config: do
    padding: {type: [], default: 0}
    width: {type: [], default: 800}
    height: {type: [], default: 600}
  init: (data, map, config) ->
    @bind data, map, config
    @render data, map, config
  bind: (data, map, config) ->
    # todo: data mapping and default is generic
    for k,v of @config => if !config[k] => config[k] = v.default
    data = data.map(-> {value: it[map.value], label: it[map.label]}).filter(->it.value)
    unit-width = ( config.width - 2 * config.padding ) / data.length 
    [min,max] = [d3.min(data.map(->it.value)),d3.max(data.map(-> it.value))]
    linear = d3.scale.linear!domain [min,max] .range [config.height - config.padding, config.padding]
    for i from 0 til data.length - 1
      data[i].next = data[i + 1].value
    data.map (v,i) -> 
      v.x = i * unit-width + config.padding
      v.y = linear v.value
      v.y-next = linear v.next
      v.width = unit-width
      v.height = linear(min) - linear(v.value)
    # todo: bind with key
    d3.select \svg .selectAll \g .data data
      ..enter!append \g
        ..append \line
        ..append \text
      ..exit!remove!
  render: (data, map, config) ->
    d3.select \svg .selectAll \g
      ..attr do
        transform: (v,i) -> "translate(#{v.x},0)"
      ..select \text
        .attr do
          y: config.height - 10 - config.padding
          x: -> it.width / 2
          "text-anchor": \middle
          "dominant-baseline": \central
        .text -> it.label
      ..select \line
        .attr do
          x1: -> it.width / 2 + config.padding
          y1: -> it.y
          x2: -> it.width * 3 / 2 + config.padding
          y2: -> it.y-next
          "stroke-width": 2
          "stroke": \black
*/
