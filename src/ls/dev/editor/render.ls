# protocol ( editor <-> renderer )
# -> init             - {chart, library}
# <- inited           - {dimension, config}  # ack for init
# -> config.set       - {config, rebind}
# <- data.sample      - {data}
# -> data.update      - {data}
# -> data.get(sample) 
# -> save
# -> snapshot         - {format}
# -> local.get
# <- local.data       - {data}
# <- error            - {msg, lineno}
# -> render           - {data, config}
# <- rendered

plotdb-domain = plConfig.urlschema + "" + plConfig.domain

send-msg = (msg) ->
  # workaround:
  #   if chart use sample data, it might contain functions from helper.
  #   if post failed due to 'cant clone function', try deleting functions from helper and try again
  try
    window.parent.postMessage msg, plotdb-domain
  catch e
    if msg.data =>
      for item in msg.data => if item.data =>
        for k,v of item.data => if typeof(v) == \function => delete item.data[k]
      window.parent.postMessage msg, plotdb-domain
store = do
  base: null    # base object from database
  chart: null   # created from plotdb.view.chart 
  module: null  # eval from code.content

# bubbling up click outside renderer. for ColorPicker
window.addEventListener \click, -> send-msg {type: \click}

# bubbling up keydown outside renderer. for panel switching
window.addEventListener \keydown, (e) ->
  send-msg type: \keydown, event: {} <<< e{keyCode, altKey, metaKey, ctrlKey, key, shiftKey, which}

dispatcher = do
  handlers: {}
  register: (name, handler) -> @handlers[][name].push(handler)
  handle: (evt) -> (@handlers[evt.data.type] or []).map -> it evt.data
  init: -> window.addEventListener \message, ((e)~>@handle e), false
  fire: (data) -> @handle {data}
dispatcher.init!

dispatcher
  ..register \config.set, (payload) ->
    {config, rebind} = payload{config, rebind}
    if !(chart = store.chart) => return
    chart.config plotdb.chart.config.parse(config), chart.inited, rebind

  # proper-eval does the same thing in view.chart.
  # yet proper-eval is designed for debugging.
  ..register \init, (payload) ->
    [base,library] = [JSON.parse(payload.chart), payload.library]
    loadlib library
      .then -> proper-eval base.code.content
      .then ->
        {chart,module} = store <<< {chart: new plotdb.view.chart base}
        send-msg do
          type: \inited
          config: JSON.stringify(plotdb.chart.config.preset(module.config))
          dimension: JSON.stringify(module.dimension)
        # TODO verify this - sample data should be request by demand?
        dispatcher.fire type: 'data.get(sample)'

  ..register \render, (payload) ->
    if !(chart = store.chart) => return send-msg type: \rendered
    chart.data(payload.data, false) if payload.data
    chart.config(payload.config) if payload.config
    chart.attach 'body > div:first-of-type', {}
    send-msg type: \rendered

  ..register \save, (payload) ->
    snapshot \png .then (payload) -> send-msg(payload <<< type: \save)

  ..register \snapshot, (payload) -> 
    snapshot payload.format .then (payload) -> send-msg(payload <<< type: \snapshot)

  ..register \data.update, (payload) ->
    if store.chart => store.chart.data payload.data, true

  ..register \local.get, ->
    send-msg {type: \local.data, data: store.chart._.chart.local}

  ..register 'data.get(sample)', -> 
    if !(chart = store.module) => return
    plotdb.chart.get-sample-data chart
    data = plotdb.chart.fields-from-dimension chart.dimension
    send-msg type: \data.sample, data: data

loadlib = (library = {}) ->
  load = (lib, url) -> new Promise (res,rej) ->
    node = document.createElement \script
      ..type = \text/javascript
      ..src = url
      ..onload = -> res lib
    document.head.appendChild node
  promise = Promise.each [{lib,url} for lib,url of library], (d) -> load(d.lib, d.url)

window.addEventListener \error, -> 
  [e,lineno] = [e.error, e.lineno or 0]
  if !e => msg = "failed with unknown error"
  else if typeof(e) != typeof({}) => msg = "#e"
  else if !e.stack => msg = e.toString!
  else msg = e.stack
  re-bloburl = /blob:http%3A\/\/[^:]+:/
  if re-bloburl.exec(msg) => msg = msg.split re-bloburl .join "line "
  if !lineno =>
    ret = /line (\d+):\d+/.exec(msg)
    lineno = if ret => parseInt(ret.1) else 0
  if msg.length > 1024 => msg = msg.substring(0,1024) + "..."
  lines = msg.split(\\n)
  if lines.length > 4 => msg = lines.splice(0,4).join(\\n)
  send-msg type: \error, data: {msg, lineno}

proper-eval = (src) -> new Promise (res, rej) ->
  code = if src.trim!0 == \{ => "(function() { store.module = #src;})()"
  else "(function() { #src; store.module = {}; })()"
  script = document.createElement("script")
  script.onload = ->
    URL.revokeObjectURL script.src
    res store.module
    document.body.removeChild script
  script.src = store.{}code.url = URL.createObjectURL new Blob [code], {type: "text/javascript"}
  document.body.appendChild script

save-local = (chart, key) -> (cb) ->
  req = new XMLHttpRequest!
  req.onload = -> if cb => cb!
  req.open \put, "#{plotdb-domain}/e/chart/#key/local", true
  req.setRequestHeader \Content-Type, "application/json;charset=UTF-8"
  req.send JSON.stringify(chart.local)

snapshot = (format='snapshot') -> new Promise (res, rej) ->
  try
    Array.from(document.querySelectorAll('body > div:first-of-type svg')).forEach((node)->
      {width, height} = node.getBoundingClientRect!
      node
        ..setAttribute "xmlns", "http://www.w3.org/2000/svg"
        ..setAttribute "xmlns:xlink", "http://www.w3.org/1999/xlink"
        ..setAttribute "width", width
        ..setAttribute "height", height
    )
    allsvg = document.querySelectorAll('body > div:first-of-type svg')
    if allsvg.length > 1 =>
      list = Array.from(allsvg).map ->
        box = it.getBoundingClientRect!
        [it.cloneNode(true), (box.right - box.left) * (box.bottom - box.top), it]
      list.sort (a,b) -> b.1 - a.1
      for i from 1 til list.length =>
        g = document.createElementNS("http://www.w3.org/2000/svg", "g")
        g.appendChild(list[i].0)
        list.0.0.insertBefore g, list.0.0.childNodes[0]
        box = list[i].2.getBoundingClientRect!
        g.setAttribute("transform", "translate(#{box.left},#{box.top})")
      svgnode = list.0.0
    else svgnode = (document.querySelector 'body > div:first-of-type svg').cloneNode(true)
    styles = svgnode.querySelectorAll("style")
    for idx from 0 til styles.length
      style = styles[idx]
      if !style.generated => continue
      svgnode.removeChild(style)
    # this insert styles into svg everytime.
    # yet cloneNode(true) on svgnode will fail the png generation
    styles = document.querySelectorAll('html style')
    for idx from styles.length - 1 to 0 by -1
      style = styles[idx].cloneNode(true)
      style.generated = true
      svgnode.insertBefore style, svgnode.childNodes.0
    {width, height} = svgnode.getBoundingClientRect!
    inline-style = svgnode.getAttribute(\style)
    svgnode.setAttribute(\style,
      inline-style + ";" + document.querySelector("body > div:first-of-type > div").getAttribute(\style)
    )
    svgnode.setAttribute(\xmlns, "http://www.w3.org/2000/svg")
    svgnode.setAttribute(\xmlns:xlink, "http://www.w3.org/1999/xlink")
    {width, height} = svgnode.getBoundingClientRect!
    if !width or !height =>
      width = +(svgnode.getAttribute("width") or 0) or +((svgnode.style.width or "").replace(/[^0-9]+$/,""))
      height = +(svgnode.getAttribute("height") or 0) or +((svgnode.style.height or "").replace(/[^0-9]+$/,""))

    ##### FOR High Resolution ( > 4000 ) Png
    if format == \png-hd
      if width > 1920 or height > 1920 =>
        width = Math.round(width * 2.1)
        height = Math.round(height * 2.1)
      else
        rate = 4000 / (( if height > width => width else height) or 1)
        width = width * rate
        height = height * rate
      svgnode.setAttribute("width", width)
      svgnode.setAttribute("height", height)
    #####

    Array.from(svgnode.querySelectorAll(\*)).forEach ->
      if it.style.opacity == 0 or it.getAttribute(\opacity) == 0 or
      it.getAttribute(\display) == \none or it.style.display == \none => it.parentNode.removeChild it

    svg = svgnode.outerHTML

    rgba-percent-to-value = (text) ->
      re = new RegExp([
        "([a-zA-Z-]+)\\s*" # attr name
        "([=:]?)\\s*(['\"]?)\\s*" # token
        "rgba\\(\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+)\\s*\\)\\s*\\3"
      ].join(""))
      str = "#{text}"
      while true
        ret = re.exec str
        if !ret => break
        des = [
          ret.1, (if ret.2 == \: => ':#' else '="#'),
          [ret.4, ret.5, ret.6].map(->
            if it[* - 1] == \%  => v = Math.round((it.substring(0,it.length - 1)) * 2.55).toString(16)
            else v = Math.round(+it).toString(16)
            if v.length < 2 => return "0#v" else v
          ).join(''),
          (if ret.2 == \: => ';' else '" '), ret.1, '-opacity',
          (if ret.2 == \: => ':' else '="'), ret.7,
          (if ret.2 == \: => '' else '"')
        ].join("")
        text = text.replace ret.0, des
        str = str.substring(ret.index + ret.1.length)
      return text

    svg = rgba-percent-to-value svg
    svgnode.setAttribute(\style, inline-style)
    if format == \svg => res {format: \svg, data: svg}
    img = new Image!
    img.onload = ->
      #newHeight = (if height > width => width else height ) #TODO crop image in server / service
      canvas = document.createElement("canvas") <<< {width, height}
      canvas.getContext \2d .drawImage img, 0, 0, width, height, 0, 0, width, height
      res {format: format, data: canvas.toDataURL!}
    # btoa doesn't work for utf-8 string
    encoded = base64.encode(utf8.encode(svg))
    img.src = "data:image/svg+xml;charset=utf-8;base64," + encoded
  catch e
    console.log e
    res {format: format, data: null}

