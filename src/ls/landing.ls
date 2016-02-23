<- $ document .ready
data = [{value: Math.random!} for i from 0 til 200]
box = document.getElementById(\landing-svg).parentNode.getBoundingClientRect!
svg = d3.select \#landing-svg
  .attr do
    width: "100%"
    height: "100%"
    viewBox: [0, 0, box.width, box.height].join(" ")
    preserveAspectRatio: "xMidYMid"
  .style do
    top: 0
    left: 0
colors = d3.scale.ordinal!range <[#1d3263 #226c87 #f8d672 #e48e11 #e03215 #ab2321]>
force = d3.layout.force!size [box.width, box.height] .gravity 0.06 .charge -200 .friction 0.4
force.nodes data

circles = svg.selectAll("circle").data(data).enter!append \circle
  .attr do
    filter: ->
      d = parseInt(( 1 - it.value ) * 4)
      console.log d
      if d => "url(\#blur#d)" else ""
speed = 1
tick = ->
  for item in data =>
    dx = (( box.width / 2 ) - item.x)
    dy = (( box.height / 2 ) - item.y)
    dd = Math.sqrt( dx ** 2 + dy ** 2 )
    if dd > 0 =>
      dx = speed * dx / dd
      dy = speed * -dy / dd
      item.x += dy
      item.y += dx
  circles.attr do
    cx: -> it.x
    cy: -> it.y
    r: -> it.value * 7 + 3
    fill: -> colors it.value
    opacity: 0.8
  if force.alpha! < 0.015 => force.alpha 0.03
  speed := speed * 0.994
  if speed < 0.2 => speed := 0.2
force.on \tick, tick
force.start!
