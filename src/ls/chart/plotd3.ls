plotd3 = {html: {}, rwd: {}}
plotd3.html.tooltip = (root, sel, cb) ->
  store = {handler: {}}
  ret = plotd3.html.popup root, null, null, store
  popup = store.popup
  ret.nodes = (sel) ->
    sel
      ..on \mousemove, (d,i) ->
        rbox = d3.select root .0.0.getBoundingClientRect!
        box = @getBoundingClientRect! #TODO getBBox fallback?
        ret.fire \mousemove, d, i, @
        popup.attr class: "pdb-popup tooltip " + "left"
        isLeft = if box.left > rbox.width/2 + rbox.left => true else false
        popup.attr class: "pdb-popup tooltip #{if isLeft => 'left' else 'right'}"
        update = ->
          pbox = popup.0.0.getBoundingClientRect!
          popup.style top: "#{box.top + box.height / 2 - pbox.height/2}px", opacity: 1
          if isLeft => popup.style left: "#{box.left - pbox.width - 10}px"
          else popup.style left: "#{box.left + box.width + 10}px"
        if popup.style("display") != \block =>
          popup.style display: \block, opacity: 0.01
          setTimeout update, 0
        else update!
      ..on \mouseout, (d,i) ->
        ret.fire \mouseout, d, i, @
        popup.style display: \none
    ret
  ret.direction = ->
    store.direction = if it == \left => \left else \right
    popup.attr class: "pdb-popup tooltip #{store.direction}"
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
    if store.hide-popup => clearTimeout store.hide-popup
    store.hide-popup = setTimeout (-> popup.style {display: \none}), 1000
  ret.nodes = (sel) ->
    sel
      ..on \mouseout, ret.hide
      ..on \mousemove, (d,i) ->
        [x,y] = [d3.event.clientX, d3.event.clientY]
        ret.fire \mousemove, d, i, @
        popup.style display: \block
        pbox = popup.0.0.getBoundingClientRect!
        rbox = root.getBoundingClientRect!
        x = x - pbox.width / 2 - rbox.left
        y = y + 20 - rbox.top
        if y > rbox.height - pbox.height - 50 => y = y - pbox.height - 40
        if x < 10 => x = 10
        if x > + rbox.width - pbox.width - 10 => x = rbox.width - pbox.width - 10
        popup.style {top: "#{y}px", left: "#{x}px"}
    ret

  ret.call = (cb) -> cb.call popup.0.0
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
  ret.on = (event, cb) -> store.handler[][event].push(cb)
  ret.type = (type) ->
    if !type => return store.type
    store.type = type
    popup.attr class: ("pdb-popup " + if store.type => that else "").trim!
  if sel => ret.nodes sel
  if cb => ret.on \mousemove, cb
  ret.type \float
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
        ..text d
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
        "dominant-baseline": "hanging"
        "text-anchor": "start"
        dy: 1
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
        "dominant-baseline": \hanging
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
      if !it => return store[k]
      store[k] = it
      return ret
    ) k

  ret

#TODO: axis labelPosition : add right, left, middle.
plotd3.rwd.axis = ->
  store = {}
  axis = d3.svg.axis!
  ret = -> ret.autotick @, arguments
  for k,v of axis =>
    if typeof(v) == \function =>
      ret[k] = ((k)-> ->
        r = axis[k].apply axis, arguments
        return if r == axis => ret else r
      ) k
  ret.offset = -> @_offset
  render = (group, sizes, offset, orient) ->
    mid = (sizes.0 + sizes.1)/2
    group.select \text.label .remove!
    group.call axis
    group.selectAll \text .attr do
      "font-size": store.font-size if store.font-size?
    if orient == \bottom =>
      setTimeout (->group.selectAll '.tick text' .attr "dy": "0.71em"), 0
    if store.label =>
      node = group.append \text .attr class: \label .text store.label
      node.attr "font-size": store.font-size if store.font-size?
      if orient in <[bottom top]> =>
        if store.labelPosition == 'in' => node.attr do
          transform: "translate(#{sizes.1} -3)"
          "text-anchor": "end"
        else node.attr do
          transform: "translate(#mid #{offset + 5})"
          "text-anchor": "middle"
      else =>
        if store.labelPosition == 'in' => node.attr do
          transform: "translate(0 #{sizes.0}) rotate(-90)"
          dy: "1em"
          "text-anchor": "end"
        else node.attr do
          transform: "translate(#{-offset - 5} #mid) rotate(-90)"
          "text-anchor": "middle"

  ret.autotick = (group, args = []) ->
    axis.apply group, args
    [scale,orient] = [axis.scale!, axis.orient!]
    if scale.rangeExtent => sizes = scale.rangeExtent!
    else
      sizes = scale.range!
      sizes = [sizes[0], sizes[1]]
      sizes.sort!
    size = Math.abs(sizes.1 - sizes.0)
    [its,ots,tp] = [axis.innerTickSize!, axis.outerTickSize!, axis.tickPadding!]
    offset = d3.max([its,ots]) + tp + 1
    format = axis.tickFormat!
    ticks = (if scale.ticks => (axis.tickValues! or scale.ticks(axis.ticks!)) else scale.domain!)
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
      render group, sizes, offset, orient
      step = 1.15 * d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.width)
      tickHeight = d3.max(group.selectAll('.tick text')[0].map (d,i) -> d.getBBox!.height)
      count = Math.ceil(ticks.length / (size / step))
      ticks = ticks.filter((d,i) -> !(i % count))
      axis.tickValues ticks
      @_offset = tickHeight + offset
    render group, sizes, @_offset, orient
    if store.label and store.labelPosition != 'in' =>
      # top, left, bottom, right all use height since it's made by rotation in left / right case
      @_offset += (group.select \text.label .0.0.getBBox!height + 5)
    if group and false => # move boundary tick inward
      gbox = group.0.0.getBBox!
      pbox = group.select \path .0.0.getBBox!
      if orient in <[left right]> =>
        group.select \g.tick:first-of-type .attr do
          transform: ->
            origin = d3.select(@).attr \transform
            "#origin translate(0 #{-(pbox.y - gbox.y)})"
        group.select \g.tick:last-of-type .attr do
          transform: ->
            origin = d3.select(@).attr \transform
            return "#origin translate(0 #{-((pbox.height - gbox.height) - (gbox.y - pbox.y))})"
      else if orient in <[bottom top]> =>
        group.select \g.tick:first-of-type .attr do
          transform: ->
            origin = d3.select(@).attr \transform
            "#origin translate(#{pbox.x - gbox.x} 0)"
        group.select \g.tick:last-of-type .attr do
          transform: ->
            origin = d3.select(@).attr \transform
            return "#origin translate(#{(pbox.width - gbox.width) - (gbox.x - pbox.x)} 0)"

  <[fontSize label labelPosition]>.map (k) ->
    ret[k] = ((k)-> ->
      if !it? => return store[k]
      store[k] = it
      return ret
    ) k
  ret
