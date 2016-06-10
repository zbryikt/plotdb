plotd3 = {html: {}, rwd: {}}
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

plotd3.rwd.legend = (font-size) ->
  store = {padding: 10}
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
      node = d3.select @
      node.select \text .text d
        .attr "font-size", font-size if font-size?
      size = node.select \text .0.0.getBBox!height * 0.8
      if store.marker => store.marker.call (node.select \path.marker .0.0), d, i
      else
        m = node.select \path.marker
        #TODO if (store.type or 'color') == 'color'
        m.attr do
          d: "M#{size/2} 0 A#{size/2} #{size/2} 0 0 0 #{size/2} #size" +
             "A#{size/2} #{size/2} 0 0 0 #{size/2} 0" # circle
          #d: "M0 0 L#size 0 L#size #size L0 #size L0 0" # rect
          fill: store.scale d
      node.select \text .attr do
        "dominant-baseline": "hanging"
        "text-anchor": "start"
        dy: 1
        dx: size + 3
        "font-size": font-size if font-size?
    offset = [0,0]
    max = [0,0]
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


  ret.offset = ->
    if !store.group => return [0,0]
    box = store.group.0.0.getBBox!
    return [box.width, box.height]

  <[type marker tickValues ticks orient scale size padding]>.map (k) ->
    ret[k] = ((k)-> ->
      if !it => return store[k]
      store[k] = it
      return ret
    ) k

  ret

plotd3.rwd.axis = (font-size) ->
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
  ret.autotick = (group, args = []) ->
    axis.apply group, args
    [scale,orient] = [axis.scale!, axis.orient!]
    sizes = scale.range!
    size = sizes.1 - sizes.0
    [its,ots,tp] = [axis.innerTickSize!, axis.outerTickSize!, axis.tickPadding!]
    offset = d3.max([its,ots]) + tp + 1
    format = axis.tickFormat!
    if orient == \left or orient == \right =>
      tickHeight = d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.height)
      count = size / ((2 * tickHeight) || 16)
      ticks = (if scale.ticks => (axis.tickValues! or scale.ticks(axis.ticks!)) else scale.domain!)
      count = Math.ceil(ticks.length / count)
      ticks = ticks.filter((d,i) -> !(i % count))
      axis.tickValues ticks
      group.call axis
        .selectAll \text .attr "font-size": font-size if font-size?
      @_offset = d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.width)
      @_offset += offset
    else
      ticks = (if scale.ticks => (axis.tickValues! or scale.ticks(axis.ticks!)) else scale.domain!)
      group.call axis
      step = 2 * d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.width)
      tickHeight = d3.max(group.selectAll(\text)[0].map (d,i) -> d.getBBox!.height)
      count = Math.ceil(ticks.length / (size / step))
      ticks = ticks.filter((d,i) -> !(i % count))
      axis.tickValues ticks
      @_offset = tickHeight + offset
    if group =>
      group.call axis
        .selectAll \text .attr "font-size": font-size if font-size?
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
  ret
