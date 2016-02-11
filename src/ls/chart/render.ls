plotdomain = \http://localhost/

# bubbling up click outside renderer. for ColorPicker
window.addEventListener \click, ->
  window.parent.postMessage {type: \click, payload: ""}, plotdomain

<- $ document .ready

dispatcher = (evt) ->
  if evt.data.type == \snapshot => snapshot!
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
  error-handling msg

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

error-handling = (e) ->
  if !e => msg = "plot failed with unknown error"
  else if typeof(e) != typeof({}) => msg = "#e"
  else if !e.stack => msg = e.toString!
  else msg = e.stack

  re-bloburl = /blob:http%3A\/\/[^:]+:/
  if re-bloburl.exec(msg) => msg = msg.split re-bloburl .join "line "
  ret = /line (\d+):\d+/.exec(msg)
  lineno = if ret => parseInt(ret.1) else 0

  if msg.length > 1024 => msg = msg.substring(0,1024) + "..."
  lines = msg.split(\\n)
  if lines.length > 4 => msg = lines.splice(0,4).join(\\n)
  console.log msg, lineno
  window.parent.postMessage {type: \error, payload: {msg, lineno}}, plotdomain

parse = (payload) ->
  try
    (module) <- proper-eval payload, false .then
    chart = module.exports
    payload = JSON.stringify({} <<< chart{dimension, config})
    window.parent.postMessage {type: \parse, payload}, plotdomain
  catch e
    error-handling e

snapshot = ->
  try
    d3.selectAll('#container svg').each ->
      {width, height} = @getBoundingClientRect!
      d3.select(@).attr do
        "xmlns": "http://www.w3.org/2000/svg"
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
        "width": width
        "height": height
    svgnode = document.querySelector '#container svg'
    {width, height} = svgnode.getBoundingClientRect!
    svg = document.querySelector '#container svg' .outerHTML
    img = new Image!
    img.onload = ->
      canvas = document.createElement("canvas") <<< {width, height}
      canvas.getContext \2d .drawImage img, 0, 0
      window.parent.postMessage {type: \snapshot, payload: canvas.toDataURL!}, plotdomain
    img.src = "data:image/svg+xml;base64," + btoa(svg)
  catch e
    window.parent.postMessage {type: \snapshot, payload: null}, plotdomain

render = (payload, rebind = true) ->
  code = payload.code.content
  style = payload.style.content
  doc = payload.doc.content
  data = payload.data
  assets = payload.assets
  config = payload.config or {}
  sched.clear!
  try
    if false and "script tag disallow" =>
      ret = /<\s*script[^>]*>.*<\s*\/\s*script\s*>/g.exec(doc.toLowerCase!)
      if ret => throw new Error("script tag is now allowed in document.")
    if rebind or !window.module =>
      $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
      promise = proper-eval code
    else promise = Promise.resolve window.module
    promise.then (module) ->
      window.module = module
      root = document.getElementById \container
      chart = module.exports
      if !data and chart.sample => data = chart.sample
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
        file.datauri = [ "data:", file.type, ";base64,", file.content ].join("")
        assetsmap[file.name] = file
      chart <<< {config}
      if rebind or !(chart.root and chart.data) or module.exec-error => chart <<< {root, data}
      if rebind or !module.inited or module.exec-error =>
        if chart.init => chart.init!
        module.inited = true
        chart.bind!
      chart.resize!
      chart.render!
      module.exec-error = false
      window.parent.postMessage {type: \error, payload: window.error-message or ""}, plotdomain
    .catch (e) ->
      module.exec-error = true
      return error-handling e
  catch e
    error-handling e

window.addEventListener \message, dispatcher, false

window.addEventListener \keydown, (e) ->
  if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
    window.parent.postMessage {type: \alt-enter}, plotdomain

window.parent.postMessage {type: \loaded}, plotdomain
