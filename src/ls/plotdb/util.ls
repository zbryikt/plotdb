plotdb.util = {}
plotdb.util.trackResizeEvent = (root, callback) ->
  style = do
    basic: position: \absolute, left: 0, top: 0, right: 0, bottom: 0
    hide:  "z-index": -1, overflow: \hidden, visibility: \hidden
    child: position: \absolute, left: 0, top: 0, transition: \0s
  style.basic <<< style.hide
  nodes = [0,0,0,0,0,0].map(->document.createElement \div)
  nodes.0.style <<< position: \relative, width: \100%, height: \100%, "z-index": -1 <<< style.hide
  nodes.1.style <<< style.basic
  nodes.2.style <<< style.basic
  nodes.3.style <<< style.basic
  nodes.4.style <<< style.child
  nodes.5.style <<< style.child <<< width: \200%, height: \200%
  nodes.0.appendChild nodes.1
  nodes.1.appendChild nodes.2
  nodes.1.appendChild nodes.3
  nodes.2.appendChild nodes.4
  nodes.3.appendChild nodes.5
  root.appendChild nodes.0
  large-number = 1000000000
  reset = ->
    nodes.4.style <<< width: "#{large-number}px", height: "#{large-number}px"
    nodes.2 <<< scrollLeft: large-number, scrollTop: large-number
    nodes.3 <<< scrollLeft: large-number, scrollTop: large-number
  reset!
  [ow, oh, nw, nh, rafid] = [0,0,0,0,0]
  on-resize = ->
    rafid := 0
    ow := nw
    oh := nh
    callback!
  on-scroll = ->
    nw := nodes.0.offsetWidth
    nh := nodes.0.offsetHeight
    dirty = nw != ow or nh != oh
    if dirty and !rafid => rafid := requestAnimationFrame on-resize
    reset!
  nodes.2.addEventListener \scroll, on-scroll
  nodes.3.addEventListener \scroll, on-scroll

