plotdomain = \http://localhost/

# bubbling up click outside renderer. for ColorPicker
window.addEventListener \click, ->
  window.parent.postMessage {type: \click, payload: ""}, plotdomain

<- $ document .ready

dispatcher = (evt) ->
  if (evt.data.type in <[snapshot getsvg getpng]>) => snapshot evt.data.type
  else if evt.data.type == \render => render evt.data.payload, evt.data.rebind
  else if evt.data.type == \parse => parse evt.data.payload
  else if evt.data.type == \reload => window.location.reload!

window.addEventListener \error, (e) ->
  re-bloburl = /blobhttp:%3A\/\/[^:]+:/
  stack = e.error.stack
  if re-bloburl.exec(stack) =>
    stack = stack.split re-bloburl .join "line "
    msg = "#{e.message} at line #{e.lineno - 1}."
    if e.message.indexOf(stack) < 0 => msg += " Callstack: \n#stack"
  else msg = "#{e.message} at line #{e.lineno - 1}."
  error-handling msg, e.lineno - 1

proper-eval = (code, updateModule = true) -> new Promise (res, rej) ->
  window.error-message = ""
  module = if updateModule => \module else \moduleLocal
  code := "(function() { #code; window.#module = module; })();"
  window.codeURL = codeURL = URL.createObjectURL new Blob [code], {type: "text/javascript"}
  codeNode = document.createElement("script")
  codeNode.onload = ->
    URL.revokeObjectURL codeURL
    res window[module]
    try
      document.body.removeChild codeNode
    catch e
  codeNode.src = codeURL
  document.body.appendChild codeNode

error-handling = (e, lineno = 0) ->
  if !e => msg = "plot failed with unknown error"
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
  window.parent.postMessage {type: \error, payload: {msg, lineno}}, plotdomain

parse = (payload) ->
  try
    (module) <- proper-eval payload, false .then
    chart = module.exports
    payload = JSON.stringify({} <<< chart{dimension, config})
    window.parent.postMessage {type: \parse, payload}, plotdomain
  catch e
    error-handling e

snapshot = (type='snapshot') ->
  try
    d3.selectAll('#container svg').each ->
      {width, height} = @getBoundingClientRect!
      d3.select(@).attr do
        "xmlns": "http://www.w3.org/2000/svg"
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
        "width": width
        "height": height
    #save the first svg #TODO save all?
    svgnode = document.querySelector '#container svg'
    styles = svgnode.querySelectorAll("style")
    for idx from 0 til styles.length
      style = styles[idx]
      if !style.generated => continue
      svgnode.removeChild(style)
    # this insert styles into svg everytime.
    # yet cloneNode(true) on svgnode will fail the png generation
    styles = document.body.querySelectorAll('#wrapper > style')
    for idx from styles.length - 1 to 0 by -1
      style = styles[idx].cloneNode(true)
      style.generated = true
      svgnode.insertBefore style, svgnode.childNodes.0
    {width, height} = svgnode.getBoundingClientRect!
    svg = svgnode.outerHTML
    if type == \getsvg =>
      return window.parent.postMessage {type: \getsvg, payload: svg}, plotdomain
    img = new Image!
    img.onload = ->
      canvas = document.createElement("canvas") <<< {width, height}
      canvas.getContext \2d .drawImage img, 0, 0
      window.parent.postMessage {type, payload: canvas.toDataURL!}, plotdomain
    img.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(svg)
  catch e
    console.log e
    window.parent.postMessage {type, payload: null}, plotdomain

render = (payload, rebind = true) ->
  [code,style,doc] = <[code style doc]>.map(->payload.{}chart[it].content)
  [data,assets] = <[data assets]>.map(->payload.chart[it])
  dimension = payload.chart.dimension or {}
  config = payload.chart.config or {}
  theme = payload.theme or {}
  reboot = !window.module or !window.module.inited or window.module.exec-error
  if reboot => sched.clear!
  try
    if false and "script tag disallow" =>
      ret = /<\s*script[^>]*>.*<\s*\/\s*script\s*>/g.exec(doc.toLowerCase!)
      if ret => throw new Error("script tag is now allowed in document.")
    #if rebind or !window.module =>
    if reboot =>
      node = document.getElementById("wrapper")
      if !node =>
        node = document.createElement("div")
        node.setAttribute("id", "wrapper")
        document.body.appendChild(node)
      # the first space in container is crucial for elliminating margin collapsing
      $(node).html([
        "<style type='text/css'>/* <![CDATA[ */#style/* ]]> */</style>"
        "<style type='text/css'>/* <![CDATA[ */#{theme.style.content}/* ]]> */</style>" if theme.{}style.content
        "<div id='container'>"
        "<div style='height:0'>&nbsp;</div>"
        doc
        theme.doc.content if theme.{}doc.content
        "</div>"
      ].join(""))
      promise = proper-eval code
    else promise = Promise.resolve window.module
    promise.then (module) ->
      window.module = module
      root = document.getElementById \container
      chart = module.exports
      if (!data or !data.length) and chart.sample => data := chart.sample
      for k,v of config =>
        for type in v.type =>
          type = plotdb[type.name]
          try
            if type.test and type.parse and type.test(v.value) =>
              v.value = type.parse v.value
              break
          catch e
            console.log "plotdb type parsing error: #{type.name}"
            console.log "#{e.stack}"
      for k,v of chart.config =>
        config[k] = if !(config[k]?) or !(config[k].value?) => v.default else config[k].value
      chart.assets = assetsmap = {}
      for file in assets =>
        raw = atob(file.content)
        array = new Uint8Array(raw.length)
        for idx from 0 til raw.length => array[idx] = raw.charCodeAt idx
        file.blob = new Blob([array],{type: file.type})
        file.url = URL.createObjectURL(file.blob)
        file.datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
        assetsmap[file.name] = file
      chart <<< {config}
      if rebind or reboot or !(chart.root and chart.data) => chart <<< {root, data, dimension}
      promise = Promise.resolve!
      if reboot and chart.init => promise = promise.then ->
        console.log "[debug] init module... reboot: #reboot / rebind: #rebind / inited: #{module.inited}"
        console.log "[debug] chart: ", chart
        console.log "[debug] init module... chart: ", chart
        console.log "[debug] init module... module: ", module
        ret = if !module.inited => chart.init! else null
        module.inited = true
        ret
      <~ promise.then
      chart.resize!
      if rebind or reboot => chart.bind!
      chart.render!
      module.exec-error = false
      window.parent.postMessage {type: \error, payload: window.error-message or ""}, plotdomain
    .catch (e) ->
      module.exec-error = true
      return error-handling e
  catch e
    error-handling e

window.addEventListener \message, dispatcher, false
resize-handler = null
window.addEventListener \resize, ->
  if resize-handler => clearTimeout resize-handler
  resize-handler := setTimeout (->
    resize-handler := null
    if !window.module or !window.module.exports => return
    chart = window.module.exports
    chart.resize!
    chart.render!
  ), 700

window.addEventListener \keydown, (e) ->
  if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
    window.parent.postMessage {type: \alt-enter}, plotdomain

window.parent.postMessage {type: \loaded}, plotdomain

# dont enable it for now
/*
hover-box = document.createElement("div")
hover-box.setAttribute("class", "hover-box")
document.body.appendChild(hover-box)
hover-margin = document.createElement("div")
hover-margin.setAttribute("class", "hover-margin")
document.body.appendChild(hover-margin)
window.addEventListener \mousemove, (e) ->
  rect = e.target.getBoundingClientRect!
  scroll = top: document.body.scrollTop, left: document.body.scrollLeft
  style = e.target.currentStyle || window.getComputedStyle(e.target);

  margin = do
    top: +style.marginTop.replace(\px,''), left: +style.marginLeft.replace(\px,'')
    bottom: +style.marginBottom.replace(\px,''), right: +style.marginRight.replace(\px,'')

  hover-box.style
    ..top    = "#{rect.top + scroll.top}px"
    ..left   = "#{rect.left + scroll.left}px"
    ..height = "#{rect.height}px"
    ..width  = "#{rect.width}px"

  hover-margin.style
    ..top    = "#{rect.top + scroll.top - margin.top}px"
    ..left   = "#{rect.left + scroll.left - margin.left}px"
    ..height = "#{rect.height + margin.top + margin.bottom}px"
    ..width  = "#{rect.width + margin.left + margin.right}px"
*/
