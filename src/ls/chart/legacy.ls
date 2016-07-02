plotdb.d3 = {}
plotdb.d3.axis = do
  overlap: (axis-group, axis, font-size) ->
    range = axis.scale!range!
    selection = axis-group.selectAll(".tick text")
    if !selection.0.length => return
    min-width = ((range.1 - range.0) / selection.length)
    max-width = d3.max(selection.0.map (d) -> d.getBBox!width)
    overlap = maxWidth / minWidth
    if font-size and overlap <2
      selection.attr do
        transform: (d,i) ->
          [
            "translate(0,",
            if ((overlap>1) and (i % 2)) => font-size else 0,
            ")"
          ].join(" ")
      axisGroup.selectAll(".tick").style { opacity: 1 }
    else
      selection.attr {transform: "" }
      axisGroup.selectAll(".tick").style do
        opacity: (d,i) -> if (i % parseInt(overlap + 1)) => 0 else 1

plotdb.d3.popup = (root, sel, cb) ->
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

