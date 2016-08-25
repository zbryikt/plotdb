<- $ document .ready
$('.loader.fixed.scrolling').css opacity: 0
setTimeout (->
  $('.loader.fixed.scrolling').css opacity: 1
), 2000
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
force = d3.layout.force!size [box.width, box.height] .gravity 0.08 .charge -300 .friction 0.5
force.nodes data

circles = svg.selectAll("circle").data(data).enter!append \circle
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
    opacity: -> 
      r = box.height * 0.8
      ret = if it.y <= r => 1 else Math.abs(50 / (it.y - (r - 50))) ** 3
      if ret < 0.01 => ret = 0
      ret
  if force.alpha! < 0.015 => force.alpha 0.03
  speed := speed * 0.994
  if speed < 0.2 => speed := 0.2
force.on \tick, tick
force.start!
