<- $ document .ready

last-data-idx = 0
last-idx = 2
setdata = (i) ->
  if !(i?) => i = last-data-idx
  chart = charts[last-idx]
  chart.data data[i][last-idx]
  chart.parse!
  chart.resize!
  chart.bind!
  chart.render!
update = (idx=-1, color) ->
  if idx>=0 => pal.colors[idx].hex = color
  chart = charts[last-idx]
  chart.config {palette: pal}
  chart.resize!
  chart.render!

$(\#land-edit-pick).on \click, (e)->
  idx = e.target.getAttribute(\idx) or e.target.parentNode.getAttribute(\idx)
  if !(idx?) => return
  idx = +idx
  $("\#land-pdb-root > div:nth-child(#{last-idx + 1})").hide!
  $("\#land-edit-pick > .ib:nth-child(#{last-idx + 1})").removeClass \active

  last-idx := idx
  $("\#land-pdb-root > div:nth-child(#{idx + 1})").show!
  $("\#land-edit-pick > .ib:nth-child(#{last-idx + 1})").addClass \active
  update!
  setdata!

generate = (seed) ->
  name = <[James Peter David Ben Cathy Tim Rob Edward Frank Eve Helen Stan]>
  dept = <[HR FIN GM RD IT]>
  gender = <[Male Female Other]>
  list = d3.range(12).map (d,i) ->
    ret = do
      name: name[i % name.length]
      dept: dept[i % dept.length]
    if seed =>
      ret.gender = gender[if Math.random! > 0.8 => 1 else 0]
      ret.workhour = Math.round( 10 * Math.random! * (10 + i % dept.length))/10 + 3
      ret.performance = Math.round( 10 * Math.random! * 100)/10 + 1
      ret.charisma = d3.range(3).map -> Math.random! + it/3
      ret.monwork = [
        Math.round(10*Math.random!*3)/10 + 6
        Math.round(10*Math.random!*5)/10 + 9
      ]
    else
      ret.gender = gender[i % gender.length]
      ret.workhour = Math.round( 10 * Math.random! * 5)/10 + 7
      ret.performance = Math.round( 10 * Math.random! * 30)/10 + 10
      ret.charisma = d3.range(3).map -> Math.random! + 0.01
      ret.monwork = [
        Math.round(10*Math.random!*2)/10 + 8
        Math.round(10*Math.random!*3)/10 + 7
      ]
    ret.charisma = ret.charisma.map -> Math.round(100 * it / d3.sum(ret.charisma))
    ret.charisma[2] = 100 - (ret.charisma[0] + ret.charisma[1])
    ret
  ret = [{},{},{},{},{}]
  ret.0 = do
    src: [{name: "", data: list.map -> it.dept}]
    des: [{name: "", data: list.map -> it.gender}]
    size: [{name: "", data: list.map -> it.workhour}]
  ret.1 = do
    value1: [{name: "", data: list.map -> it.charisma.0}]
    value2: [{name: "", data: list.map -> it.charisma.1}]
    value3: [{name: "", data: list.map -> it.charisma.2}]
  ret.2 = do
    category: [{name: "", data: list.map -> it.dept}]
    name: [{name: "", data: list.map -> it.name}]
    value: [{name: "", data: list.map -> it.workhour}]
  ret.3 = do
    order: [{name: "", data: <[Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec]>}]
    values: [
      {name: "Female", data: list.map -> it.monwork.0}
      {name: "Male", data: list.map -> it.monwork.1}
    ]
  ret.4 = do
    category: [{name: "Dept.", data: list.map -> it.dept}]
    name: [{name: "Name", data: list.map -> it.name}]
    value: [{name: "", data: list.map -> it.performance}]
  ret

data = [generate(0), generate(1)]

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
    root = $("\#land-pdb-root > div:nth-child(#{i + 1})")
    node = $("\#land-pdb-root > div:nth-child(#{i + 1}) > div").0
    chart = charts[i]
    chart.config {palette: pal, value1Label: "Creativity", value2Label: "Dignity", value3Label: "Logic"}
    chart.data data[0][i]
    chart.attach node
    if i == 2 => root.show! else root.hide!
    root.css \opacity, 1
  for i from 1 til 3 =>
    ((v) ->
      node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#v)")
      node.on \click, ->
        node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#{last-data-idx + 1})").removeClass \active
        setdata v - 1
        last-data-idx := v - 1
        node = $("\#land-edit-cog .btn-group .btn-default:nth-child(#{last-data-idx + 1})").addClass \active
    ) i
  for i from 0 til 6 =>
    ((v) ->
      node = $("\#land-edit-cog .color:nth-child(#{v})").0
      ldcp = new ldColorPicker node, do
        index: (v - 1)>?0, exclusive: true, class: 'no-palette no-alpha', palette: pal, context: 'common'
      if !node => return
      ldcp.on \change ->
        node.style.background = it
        update v - 1, it
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
