plotd3 = {svg: {}, html: {}}
plotd3.html.popup = (root, sel, cb) ->
  popup = root.querySelector(\.pdb-popup)
  if !popup =>
    popup = d3.select root .append \div .attr class: 'pdb-popup float'
    popup.each (d,i) -> d3.select(@)
      ..append \div .attr class: \title
      ..append \div .attr class: \value
  else popup = d3.select popup
  sel
    ..on \mousemove, (d,i) ->
      [x,y] = [d3.event.clientX, d3.event.clientY]
      cb.call @,d,i,popup
      popup.style display: \block
      pbox = popup.0.0.getBoundingClientRect!
      rbox = root.getBoundingClientRect!
      x = x - pbox.width / 2
      y = y + 20
      if y > rbox.top + rbox.height - pbox.height - 50 => y = y - pbox.height - 40
      if x < 10 => x = 10
      if x > rbox.left + rbox.width - pbox.width - 10 => x = rbox.left + rbox.width - pbox.width - 10
      popup.style {top: "#{y}px", left: "#{x}px"}
    ..on \mouseout, ->
      if sel.hide-popup => clearTimeout sel.hide-popup
      sel.hide-popup = setTimeout (-> popup.style {display: \none}), 1000

plotd3.svg.rwdAxis = ->
  ret = d3.svg.axis!
  ret.autotick = (size, fontSize = 12, group) ->
    maxCount = 10
    scale = @scale!
    orient = @orient!
    [its,ots,tp] = [@innerTickSize!, @outerTickSize!, @tickPadding!]
    offset = d3.max([its,ots]) + tp + 1
    format = @tickFormat!

    if orient == \left or orient == \right =>
      count = size / ((2 * fontSize) || 16)
      ticks = (if scale.ticks => (@tickValues! or scale.ticks(@ticks!)) else scale.domain!)
      count = Math.ceil(ticks.length / count)
      ticks = ticks.filter((d,i) -> !(i % count))
      @tickValues ticks
      group.call @
      group.selectAll('.tick text').attr 'font-size': fontSize
      @_offset = d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.width)
      @_offset += offset
    else
      ticks = (if scale.ticks => (@tickValues! or scale.ticks(@ticks!)) else scale.domain!)
      group.call @
      group.selectAll('.tick text').attr 'font-size': fontSize
      step = 2 * d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.width)
      count = Math.ceil(ticks.length / (size / step))
      ticks = ticks.filter((d,i) -> !(i % count))
      @tickValues ticks
      @_offset = 2 * fontSize + offset
      if group => group.call @

  ret.offset = -> @_offset
  ret
