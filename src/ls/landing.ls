<- $ document .ready

last-data-idx = 0
last-idx = 0
setdata = (i) ->
  chart = charts[last-idx]
  chart.data data[i]
  chart.parse!
  chart.bind!
  chart.resize!
  chart.render!
update = (idx=-1, color) ->
  if idx>=0 => pal.colors[idx].hex = color
  chart = charts[last-idx]
  chart.config {palette: pal}
  chart.resize!
  chart.render!

$(\#land-edit-pick).on \click, (e)->
  idx = +(e.target.getAttribute(\idx) or e.target.parentNode.getAttribute(\idx))
  $("\#land-pdb-root > div:nth-child(#{last-idx + 1})").hide!
  $("\#land-edit-pick > .ib:nth-child(#{last-idx + 1})").removeClass \active

  last-idx := idx
  $("\#land-pdb-root > div:nth-child(#{idx + 1})").show!
  $("\#land-edit-pick > .ib:nth-child(#{last-idx + 1})").addClass \active
  update!

data = [null,null]
d1value = d3.range(12).map(->Math.round(Math.random!*100))
name = <[James Peter David Ben Cathy Tim Rob Edward Frank Eve Helen Stan]>
d1cat1 = <[HR FIN GM RD IT]>
d1cat2 = <[M F]>
data[0] = do
  category: [{name: "", data: d1value.map((d,i)->d1cat1[i%5])}]
  src: [{name: "", data: d1value.map((d,i)->d1cat1[i%5])}]
  des: [{name: "", data: d1value.map((d,i)->d1cat2[i%2])}]
  name: [{name: "", data: d1value.map(->"")}]
  value: [{name: "", data: d1value}]
  size: [{name: "", data: d1value}]
  values: [{name: "KPI", data: d1value}]
  value1: [{name: "", data: d1value}]
  value2: [{name: "", data: d1value.map(-> Math.round((100 - it) * Math.random!))}]
data[0].value3 = [{name: "", data: d1value.map((d,i)-> 100 - d - data[0].value2.0.data[i])}]

d2value = d3.range(12).map(->Math.round(Math.random!*100))
name = <[James Peter David Ben Cathy Tim Rob Edward Frank Eve Helen Stan]>
d2cat1 = <[HR FIN GM RD IT]>
d2cat2 = <[M F]>
data[1] = do
  category: [{name: "", data: d2value.map((d,i)->d2cat1[i%5])}]
  src: [{name: "", data: d2value.map((d,i)->d2cat1[i%5])}]
  des: [{name: "", data: d2value.map((d,i)->d2cat2[i%2])}]
  name: [{name: "", data: d2value.map(->"")}]
  value: [{name: "", data: d2value}]
  size: [{name: "", data: d2value}]
  values: [{name: "KPI", data: d2value}]
  value1: [{name: "", data: d2value}]
  value2: [{name: "", data: d2value.map(-> Math.round((100 - it) * Math.random!))}]
data[1].value3 = [{name: "", data: d2value.map((d,i)->100 - d - data[1].value2.0.data[i])}]

pal = {colors: [
  {hex: \#d54876},
  {hex: \#eaac34},
  {hex: \#f2e336},
  {hex: \#66b2a2},
  {hex: \#3c5496},
]}

charts = []
plotdb.load \/assets/json/samples.json, (ret) ->
  charts := ret
  for i from 0 til charts.length =>
    node = $("\#land-pdb-root > div:nth-child(#{i + 1})").0
    chart = charts[i]
    chart.config {palette: pal}
    chart.data data[0]
    chart.attach node
    if i == 0 => $(node).show! else $(node).hide!
  for i from 1 til 3 =>
    ((v) ->
      node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#v)")
      node.on \click, ->
        node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#last-data-idx)").removeClass \active
        setdata v - 1
        last-data-idx := v
        node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#last-data-idx)").addClass \active
    ) i
  for i from 0 til 5 =>
    ((v) ->
      node = $("\#land-edit-cog .color:nth-child(#{v + 1})").0
      ldcp = new ldColorPicker node, {index: v, exclusive: true, class: 'no-palette no-alpha', palette: pal}
      ldcp.on \change, ->
        node.style.background = it
        update v, it
    ) i

/*
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

*/
