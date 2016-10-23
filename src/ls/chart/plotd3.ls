plotd3 = {html: {}, rwd: {}}
plotd3.html.tooltip = (root, sel, cb) ->
  store = {handler: {}}
  ret = plotd3.html.popup root, null, null, store
  popup = store.popup
  setblock = (d,i) ->
    if typeof(store.active) == \function => if !store.active(d,i) => return
    else if !store.active => return
    rbox = root.getBoundingClientRect!
    box = @getBoundingClientRect! #TODO getBBox fallback?
    if store.coord =>
      [left,top,width,height] = store.coord.call @, d, i
      box = {left,top,width,height}
    ret.fire(\mousemove, d, i, @)
    isLeft = if box.left > rbox.width/2 + rbox.left => true else false
    popup.attr class: "pdb-popup pdb-tooltip #{if isLeft => 'left' else 'right'}"
    update = ->
      pbox = popup.0.0.getBoundingClientRect!

      popup.style top: "#{box.top + box.height / 2 - pbox.height/2 - rbox.top}px", opacity: 1
      left = if isLeft => box.left - pbox.width - 10 - rbox.left
      else box.left + box.width + 10 - rbox.left
      #popup.style top: "#{box.top + box.height / 2 - pbox.height/2}px", opacity: 1
      #left = if isLeft => box.left - pbox.width - 10
      #else box.left + box.width + 10
      #
      if left < 3 => left = 3

      #if left + pbox.width >= rbox.width - 3=> left = rbox.width - pbox.width - 3
      #popup.style left: "#{left}px"
      if isLeft => popup.style left: "#{box.left - pbox.width - 10 - rbox.left}px"
      else popup.style left: "#{box.left + box.width + 10 - rbox.left}px"

    if popup.style("display") != \block =>
      popup.style display: \block, opacity: 0.01
      setTimeout update, 0
    else update!

  ret.nodes = (sel) ->
    sel
      ..on \mouseover, (d,i) -> ret.fire \mouseover, d, i, @
      ..on \mousemove, setblock

      ..on \mouseout, (d,i) ->
        ret.fire \mouseout, d, i, @
        popup.style display: \none
    ret
  ret.direction = ->
    store.direction = if it == \left => \left else \right
    popup.attr class: "pdb-popup pdb-tooltip #{store.direction}"
  ret.showByEvent = (d,i) -> setblock d,i
  ret.show = (x,y) ->
    bbox = popup.0.0.getBoundingClientRect!
    if store.direction != \right => x = x - (bbox.right - bbox.left) - 10
    else x = x + 10
    popup.style display: \block
    popup.style top: "#{y - (bbox.bottom - bbox.top)/2}px", left: "#{x}px"
    ret.hide!

  ret.type \tooltip
  ret

plotd3.html.float = (root, sel, cb) ->
  ret = plotd3.html.popup root, sel, cb
  ret.type \float
  ret

plotd3.html.popup = (root, sel, cb, store = {handler: {}}) ->
  #TODO svg vs html version
  popup = store.popup = d3.select root .append \div
  popup.each (d,i) -> d3.select(@)
    ..append \div .attr class: \title
    ..append \div .attr class: \value
  popup.on \mouseover, -> d3.select @ .style display: \none
  ret = ->
  ret.hide = (d,i) ->
    if d? and i? => ret.fire \mouseout, d, i, @
    if ret.hide-popup => clearTimeout ret.hide-popup
    ret.hide-popup = setTimeout (-> popup.style {display: \none}), 1000
  ret.getPopupNode = -> popup
  setblock = (d,i) ->
    if typeof(store.active) == \function => if !store.active(d,i) => return
    else if !store.active => return
    [x,y] = [d3.event.clientX, d3.event.clientY]
    if store.coord => [x,y,width,height] = store.coord.call @, d, i
    ret.fire(\mousemove, d, i, @)
    popup.style display: \block
    pbox = popup.0.0.getBoundingClientRect!
    rbox = root.getBoundingClientRect!
    x = x - pbox.width / 2 - rbox.left
    y = y + 30 - rbox.top
    if y > rbox.height - pbox.height - 50 => y = y - pbox.height - 40
    if x < 10 => x = 10
    if x > + rbox.width - pbox.width - 10 => x = rbox.width - pbox.width - 10
    popup.style {top: "#{y}px", left: "#{x}px"}

  ret.nodes = (sel) ->
    sel
      ..on \mouseover, (d,i) -> ret.fire \mouseove, d, i, @
      ..on \mouseout, ret.hide
      ..on \mousemove, setblock
    ret
  ret.coord = (cb) ->
    if cb? => store.coord = cb else return store.coord
    ret
  ret.call = (cb) -> cb.call popup.0.0
  ret.showByEvent = (d, i) -> setblock d,i
  ret.show = (x, y) ->
    popup.style display: \block
    popup.style top: "#{y}px", left: "#{x}px"
    ret.hide!
  ret.fire = (event, d, i, node) ->
    store.handler[][event].forEach (cb) -> cb.call node, d, i, popup
  ret.fontSize = (fs) ->
    if fs? =>
      store.fontSize = fs
      popup.style "font-size": "#{fs}px"
      return ret
    else return store.fontSize
  ret.on = (event, cb) ->
    store.handler[][event].push(cb)
    ret
  <[active]>.map (k) ->
    ret[k] = ((k)-> ->
      if !arguments.length => return store[k]
      store[k] = it
      return ret
    ) k

  ret.type = (type) ->
    if !type => return store.type
    store.type = type
    popup.attr class: ("pdb-popup " + if store.type => that else "").trim!
  if sel => ret.nodes sel
  if cb => ret.on \mousemove, cb
  ret.type \float
  ret

plotd3.rwd.overlap = ->
  store = {padding: [10,5]}
  ret = ->
  ret.nodes = (sel,accessor=(->it)) ->
    #bbox = sel[0].map (d,i) -> [d.getBBox!, accessor(d3.select(d).datum!,i),1,i]
    # this bounding box is formed from minimal and maximal values in x / y coordinates,
    # which covers unused space, even the text is diagonal placed.
    bbox = sel[0].map (d,i) -> [d.getBoundingClientRect!, accessor(d3.select(d).datum!,i),1,i]
    bbox.forEach (d) ->
      b = d[0]
      b.height = b.bottom - b.top
      b.width = b.right - b.left
      b.x = b.left
      b.y = b.top
    if store.fitText => bbox.forEach (d) ->
      b = d.0
      center = (b.y + b.height / 2)
      b.y = center - b.height * (store.fitText/2)
      b.height = b.height * ( 1 - store.fitText)
    bbox.sort (a,b) -> b.1 - a.1
    for i from 0 til bbox.length
      if !bbox[i].2 => continue
      for j from i + 1 til bbox.length
        [ni,nj] = [bbox[i].0, bbox[j].0]
        if !(nj.x > ni.x + ni.width or nj.x + nj.width < ni.x or
        nj.y > ni.y + ni.height or nj.y + nj.height < ni.y) => bbox[j].2 = 0

    bbox.forEach (d) ->
      data = d3.select(sel[0][d.3]).datum!
      if !data => return
      data.overlap = !!!d.2
      if store.opacity => d3.select(sel[0][d.3]).attr opacity: (if d.2 => 1 else (store.opacity or 0))
      if store.remove and !d.2 => d3.select(sel[0][d.3]).remove!
    sel
  <[remove opacity fitText]>.map (k) ->
    ret[k] = ((k)-> ->
      if !arguments.length => return store[k]
      store[k] = it
      return ret
    ) k

  ret

plotd3.rwd.legend = ->
  store = {padding: [10,5]}
  ret = ->
    store.group = @
    if store.tick-values => data = that
    else if !store.scale => data = [0,1]
    else if store.scale.invert => data = store.scale.ticks(store.ticks or 5)
    else data = store.scale.domain!
    @.selectAll \g.legend .data data
      ..enter!append \g .attr class: \legend
        .each (d,i) ->
          node = d3.select @
          node.append \path .attr class: \marker
          node.append \text
      ..exit!remove!
    @.selectAll \g.legend .each (d,i) ->
      if store.type == \radius and !d => return
      node = d3.select @
      node.select \text
        ..text "#d"
        ..attr "font-size", store.font-size if store.font-size?
      size = node.select \text .0.0.getBBox!height * 0.8
      if store.marker => store.marker.call (node.select \path.marker .0.0), d, i
      else
        m = node.select \path.marker
        #TODO if (store.type or 'color') == 'color'
        if (store.type or \color) == \color =>
          m.attr do
            d: "M#{size/2} 0 A#{size/2} #{size/2} 0 0 0 #{size/2} #size" +
               "A#{size/2} #{size/2} 0 0 0 #{size/2} 0" # circle
            fill: store.scale d
        else if store.type == \radius =>
          r = store.scale d
          m.attr do
            cx: r, cy: r, r: r
            d: "M#{size/2} #{size/2 - r} A#r #r 0 0 0 #{size/2} #{size/2 + r}" +
               "A#r #r 0 0 0 #{size/2} #{size/2 - r}"
            fill: \#999
      dx = 0
      if store.type == \radius => dx = store.scale data[* - 1]
      node.select \text .attr do
        "text-anchor": "start"
        dy: \0.76em
        dx: size + 3 + dx
        "font-size": store.font-size if store.font-size?
    offset = [0,0]
    max = [0,0]
    @select \text.label .remove!
    if store.label =>
      label = @append \text .attr class: \label .text store.label
      label.attr do
        "font-size": (store.font-size * 1.1) if store.font-size?
        "font-weight": \bold
        dy: \0.76em
      if store.orient in <[bottom top]> => offset.0 += label.0.0.getBBox!width + store.padding.0 or 10
      else =>
        offset.1 += label.0.0.getBBox!height + store.padding.1 or 5

    @.selectAll \g.legend .each (d,i) ->
      node = d3.select @ .attr {transform: "translate(#{offset.0} #{offset.1})"}
      [w,h] = [@getBBox!width, @getBBox!height]
      if store.orient in <[bottom top]> =>
        if store.size and store.size.0 < offset.0 + w =>
          offset.0 = 0
          offset.1 += h + (store.padding.1 or 5)
          node = d3.select @ .attr {transform: "translate(#{offset.0} #{offset.1})"}
        offset.0 += (w + (store.padding.0 or 10))
      else
        if max.0 < w => max.0 = w
        if store.size and store.size.1 < offset.1 + h =>
          offset.1 = 0
          offset.0 += max.0 + (store.padding.0 or 10)
          node = d3.select @ .attr {transform: "translate(#{offset.0} #{offset.1})"}
        offset.1 += (h + (store.padding.1 or 5))
        offset.1 += (if store.type == \radius => 3 else 0)


  ret.offset = ->
    if !store.group => return [0,0]
    box = store.group.0.0.getBBox!
    return [box.width, box.height]

  <[label fontSize type marker tickValues ticks orient scale size padding]>.map (k) ->
    ret[k] = ((k)-> ->
      if !arguments.length => return store[k]
      store[k] = it
      return ret
    ) k

  ret

#TODO: axis labelPosition : add right, left, middle.
plotd3.rwd.axis = ->
  store = {orient: "bottom"}
  axis = d3.svg.axis!
  ret = -> ret.autotick @, arguments
  for k,v of axis =>
    if typeof(v) == \function =>
      ret[k] = ((k)-> ->
        r = axis[k].apply axis, arguments
        return if r == axis => ret else r
      ) k
  ret.offset = -> @_offset
  set-style = (group, orient) ->
    if orient == \bottom and store.tick-direction != \vertical =>
      group.selectAll '.tick text' .attr "dy": \0.71em
    if store.tick-direction == \vertical =>
      group.selectAll '.tick text'
        .style do
          'text-anchor': (if orient == \bottom => \start else if orient == \top => \end else \middle)
        .attr dy: 0
  render = (group, sizes, offset, orient) ->
    mid = (sizes.0 + sizes.1)/2
    group.select \text.label .remove!
    group.call axis
    group.selectAll \text .attr do
      "font-size": store.font-size if store.font-size?
      "writing-mode": \tb-rl if store.tick-direction == \vertical
    if orient == \radius =>
      scale = axis.scale!
      ticks = (if scale.ticks => (axis.tickValues! or scale.ticks(axis.ticks!)) else scale.domain!)
      group.selectAll \path.textpath .data(ticks or [])
        ..exit!remove!
        ..enter!append \path .attr class: \textpath
      group.selectAll \path.textpath .attr do
        id: (d,i) -> "plotd3-rwd-axis-radius-#d-#i"
        fill: \none
        stroke: \#999
        display: \none if !store.showGrid
        "stroke-width": 1
        d: (d,i) ->
          r = scale(d)
          "M1 #{-r} A#r #r 0 1 1 0 #{-r}"
      group.selectAll \.tick .attr do
        transform: (d,i) ->
          if store.showGrid => return "translate(0 0)"
          x = scale(d) * Math.sin((store.angle or 0))
          y = scale(d) * -Math.cos((store.angle or 0))
          "translate(#x #y)"
      group.selectAll '.tick line' .attr display: \none
      group.selectAll '.tick text'
        .attr do
          x: 0, y: 0, dx: 1, dy: -2,
          transform: "rotate(#{180 * store.angle / Math.PI})" if !store.showGrid
        .style do
          "text-anchor": \start
      if store.showGrid => group.selectAll '.tick text' .each (d,i) ->
        d3.select @ .text ""
        d3.select @ .selectAll \textPath .data [1] .enter!append \textPath
          ..attr do
            "xlink:href": -> "\#plotd3-rwd-axis-radius-#d-#i"
            "startOffset": "#{store.angle * 100 /(Math.PI * 2)}%"
            "spacing": "auto"
          ..text d

      group.select \.domain .attr do
        d: ->
          domain = scale.domain!
          x1 = scale(domain[0]) * Math.sin(store.angle or 0)
          y1 = scale(domain[0]) * -Math.cos(store.angle or 0)
          x2 = scale(domain[* - 1]) * Math.sin(store.angle or 0)
          y2 = scale(domain[* - 1]) * -Math.cos(store.angle or 0)
          "M#x1 #y1 L#x2 #y2"
    set-style group, orient
    if store.label =>
      node = group.append \text .attr class: \label .text store.label
      node.attr "font-size": store.font-size if store.font-size?
      if orient in <[bottom top]> =>
        if store.labelPosition == 'in' => node.attr do
          transform: "translate(#{sizes.1} -3)"
          "text-anchor": "end"
        else
          dy = offset + 5
          if orient == \bottom => dy += store.font-size or 0
          else dy *= -1
          node.attr do
            transform: "translate(#mid #dy)"
            "text-anchor": "middle"
      else =>
        if store.labelPosition == 'in' => node.attr do
          transform: "translate(0 #{sizes.0}) rotate(-90)"
          dy: "1em"
          "text-anchor": "end"
        else
          dx = (offset + 5)
          if orient == \right => dx += store.font-size or 0
          else dx *= -1
          node.attr do
            transform: "translate(#dx #mid) rotate(-90)"
            "text-anchor": "middle"

  ret.autotick = (group, args = []) ->
    axis.apply group, args
    [scale,orient] = [axis.scale!, store.orient]
    set-style group, orient
    if scale.rangeExtent => sizes = scale.rangeExtent!
    else
      sizes = scale.range!
      sizes = [sizes[0], sizes[sizes.length - 1]]
      sizes.sort (a,b) -> a - b
    size = Math.abs(sizes.1 - sizes.0)
    [its,ots,tp] = [axis.innerTickSize!, axis.outerTickSize!, axis.tickPadding!]
    offset = d3.max([its,ots]) + tp + 1
    format = axis.tickFormat!
    count = axis.ticks!0
    ticks = axis.tickValues! or (
      if scale.ticks => scale.ticks (if count => count else 10)
      else
        if count =>
          domain = scale.domain!
          domain.filter (d,i) -> !(i % Math.round(domain.length / ( count or 1)))
        else scale.domain!
    )
    if ticks.length > count and count =>
      ticks = ticks.filter (d,i) -> !(i % Math.round(ticks.length / ( count or 1)))

    if orient == \left or orient == \right =>
      tickHeight = d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.height)
      count = size / ((1.4 * tickHeight) || 14)
      count = Math.ceil(ticks.length / count)
      ticks = ticks.filter((d,i) -> !(i % count))
      axis.tickValues ticks
      render group, sizes, offset, orient
      @_offset = d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.width)
      @_offset += offset
    else
      axis.tickValues ticks
      render group, sizes, offset, orient
      step = 1.15 * d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.width)
      tickHeight = d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.height)
      count = Math.ceil(ticks.length / (size / step))
      if !store.handleOverlap or store.handleOverlap == \hidden =>
        ticks = ticks.filter((d,i) -> !(i % count))
      else if store.handleOverlap == \offset =>
        group.selectAll('.tick text').attr do
          transform: (d,i) ->
            if count > 1 and !(i % count) => return "translate(0 #{store.fontSize or 14})"
            return ""
      else if store.handleOverlap == \none => # do nothing
      axis.tickValues ticks
      render group, sizes, offset, orient
      tickHeight = d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.height)
      @_offset = tickHeight + offset
    render group, sizes, @_offset, orient
    if store.label and store.labelPosition != 'in' =>
      # top, left, bottom, right all use height since it's made by rotation in left / right case
      @_offset += (group.select \text.label .0.0.getBBox!height + 5)
    if store.boundaryTickInside => # move boundary tick inward
      gbox = group.0.0.getBBox!
      pbox = group.select \path .0.0.getBBox!
      if orient in <[left right]> =>
        group.select 'g.tick:first-of-type text' .attr dy: -store.fontSize/2
        group.select 'g.tick:last-of-type text' .attr dy: store.fontSize
      else if orient in <[bottom top]> =>
        group.select 'g.tick:first-of-type text' .style "text-anchor": \start
        if group.selectAll(\g.tick).0.length > 1 =>
          group.select 'g.tick:last-of-type text' .style "text-anchor": \end
    group.selectAll "path,line" .attr {stroke: \black, fill: \none}

  <[
    tickCount fontSize label labelPosition multiLine boundaryTickInside
    tickDirection angle showGrid handleOverlap
  ]>.map (k) ->
    ret[k] = ((k)-> ->
      if !arguments.length => return store[k]
      store[k] = it
      return ret
    ) k
  ret.orient = ->
    if !it? => return store.orient
    store.orient = it
    axis.orient it
    return ret
  ret

plotd3.rwd.grid = ->
  store = {orient: "horizontal", length: 0}
  ret = (group)->
    scale = store.scale
    ticks = if store.tickValues => that else if store.ticks => scale.ticks(that) else scale.ticks!
    if <[horizontal vertical angle]>.indexOf(store.orient) >= 0 =>
      len = store.size
      group.selectAll "line.grid.#{store.orient}" .data ticks
        ..exit!remove!
        ..enter!append \line .attr class: "grid #{store.orient}"
      if store.orient == \angle =>
        group.selectAll "line.grid.angle" .attr do
          x1: 0, y1: 0
          x2: -> Math.cos(scale(it)) * len
          y2: -> Math.sin(scale(it)) * len
      if store.orient == \horizontal =>
        group.selectAll "line.grid.horizontal" .attr x1: 0, x2: len,  y1: scale, y2: scale
      if store.orient == \vertical =>
        group.selectAll "line.grid.vertical" .attr x1: scale, x2: scale, y1: 0, y2: len
    else if store.orient == \radial =>
      group.selectAll "circle.grid.radial" .data ticks
        ..exit!remove!
        ..enter!append \circle .attr class: "grid radial"
    group.selectAll \.grid .attr do
      stroke: store.stroke if store.stroke
      "stroke-width": store.strokeWidth if store.strokeWidth
      "stroke-dasharray": store.strokeDashArray if store.strokeDashArray
      fill: \none

  <[orient tickValues size ticks scale stroke strokeWidth strokeDashArray]>.map (k) ->
    ret[k] = ((k)-> ->
      if !arguments.length => return store[k]
      store[k] = it
      return ret
    ) k
  ret
