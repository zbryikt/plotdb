plotdb-domain = "#{window.plConfig.urlschema}#{window.plConfig.domain}"
brand-new = true

# bubbling up click outside renderer. for ColorPicker
window.addEventListener \click, ->
  window.parent.postMessage {type: \click, payload: ""}, plotdb-domain

window.thread = do
  count: 0
  inc: (t) -> if t => @count = (@count or 0) + 1
  dec: (t) -> if t => @count = (@count or 1) - 1
  racing: -> @count > 1

<- $ document .ready

dispatcher = (evt) ->
  if (evt.data.type in <[snapshot getsvg getpng]>) => snapshot evt.data.type
  else if evt.data.type == \render => render evt.data.payload, evt.data.rebind
  else if evt.data.type == \parse-chart => parse evt.data.payload, \chart
  else if evt.data.type == \parse-theme => parse evt.data.payload, \theme
  else if evt.data.type == \reload =>
    if !brand-new => window.location.reload!
    else window.parent.postMessage {type: \loaded}, plotdb-domain
  else if evt.data.type == \colorblind-emu => colorblind evt.data.payload

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
  empty="{exports:{init:function(){},update:function(){},resize:function(){},bind:function(){},render:function(){}}}"
  window.error-message = ""
  module = if updateModule => \module else \moduleLocal
  code := "(function() { #code; window.#module = (typeof(module)=='undefined'?#empty:module); })()"
  window.codeURL = codeURL = URL.createObjectURL new Blob [code], {type: "text/javascript"}
  codeNode = document.createElement("script")
  codeNode.onload = ->
    URL.revokeObjectURL codeURL
    if window[module] => window[module].identity = parseInt(Math.random!*1000)
    #TODO: potential race condition?
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
  window.parent.postMessage {type: \error, payload: {msg, lineno}}, plotdb-domain

colorblind = (payload) ->
  val = <[normal protanopia protanomaly deuteranopia deuteranomaly tritanopia
  tritanomaly achromatopsia achromatomaly]>
  if !(payload in val) => payload = \normal
  d3.select(\body).style do
    "-webkit-filter": "url('\##payload')"
    "filter": "url('\##payload')"

parse = (payload, type) ->
  try
    if type == \chart =>
      (module) <- proper-eval payload, false .then
      chart = module.exports
      payload = JSON.stringify({} <<< chart{dimension, config})
      window.parent.postMessage {type: \parse-chart, payload}, plotdb-domain
    else if type == \theme =>
      (module) <- proper-eval payload, false .then
      theme = module.exports
      payload = JSON.stringify({} <<< theme{typedef, config})
      window.parent.postMessage {type: \parse-theme, payload}, plotdb-domain

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
      return window.parent.postMessage {type: \getsvg, payload: svg}, plotdb-domain
    img = new Image!
    img.onload = ->
      newHeight = (if height > width => width else height )
      canvas = document.createElement("canvas") <<< {width, height: newHeight}
      canvas.getContext \2d .drawImage img, 0, 0, width, newHeight, 0, 0, width, newHeight
      window.parent.postMessage {type, payload: canvas.toDataURL!}, plotdb-domain
    # btoa doesn't work for utf-8 string
    encoded = base64.encode(utf8.encode(svg))
    img.src = "data:image/svg+xml;charset=utf-8;base64," + encoded
  catch e
    console.log e
    window.parent.postMessage {type, payload: null}, plotdb-domain

load-sample = (dimension, sample) ->
  if Array.isArray(sample) => return sample
  for k,v of dimension
    if sample[k] => v.fields = sample[k]
  data = []
  len = Math.max.apply null,
    [v for k,v of dimension]
      .reduce(((a,b) -> (a) ++ (b.fields or [])),[])
      .filter(->it.data)
      .map(->it.data.length) ++ [0]
  for i from 0 til len
    ret = {}
    for k,v of dimension
      if v.multiple =>
        ret[k] = if v.[]fields.length => v.[]fields.map(->it.[]data[i]) else []
        v.field-name = v.[]fields.map -> it.name
      else
        ret[k] = if v.[]fields.0 => that.[]data[i] else null
        v.field-name = if v.[]fields.0 => that.name else null
      #TODO need correct type matching
      if v.type.filter(->it.name == \Number).length =>
        if Array.isArray(ret[k]) => ret[k] = ret[k].map(->parseFloat(it))
        else ret[k] = parseFloat(ret[k])
    data.push ret
  return data

render = (payload, rebind = true) ->
  [code,style,doc] = <[code style doc]>.map(->payload.{}chart[it].content)
  [data,assets] = <[data assets]>.map(->payload.chart[it])
  dimension = payload.chart.dimension or {}
  config = payload.chart.config or {}
  theme = payload.theme or {}
  reboot = !window.module or !window.module.inited or window.module.exec-error
  if reboot => sched.clear!
  # sometimes multiple thread enter this function
  # they stop at proper-eval which overwrite module again and again
  # this leads to the reinit of chart, then duplicate charts.
  # use thread.racing to prevent this situaiton.
  thread.inc reboot
  try
    if false and "script tag disallow" =>
      ret = /<\s*script[^>]*>.*<\s*\/\s*script\s*>/g.exec(doc.toLowerCase!)
      if ret => throw new Error("script tag is not allowed in document.")
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
      if thread.racing! => return thread.dec reboot
      #window.module = module
      root = document.getElementById \container
      chart = module.exports
      if (!data or !data.length) and chart.sample =>
        data := plotdb.chart.get-sample-data chart, dimension
      for k,v of (config or {}) =>
        for type in (v.type or [])=>
          try
            type = plotdb[type.name]
            if type.test and type.parse and type.test(v.value) =>
              v.value = type.parse v.value
              break
          catch e
            console.log "chart config: type parsing exception ( #k / #type )"
            console.log "#{e.stack}"
            thread.dec reboot
            return error-handling "Exception parsing chart config '#k'"
      for k,v of chart.config =>
        if !(config[k]?) => config[k] = v.default
        else if !(config[k].value?) => config[k] = (v or config[k]).default
        else config[k] = config[k].value
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
        if thread.racing! => return
        ret = if !module.inited => chart.init! else null
        module.inited = true
        ret
      <~ promise.then
      if thread.racing! => return thread.dec reboot
      chart.resize!
      if rebind or reboot => chart.bind!
      chart.render!
      module.exec-error = false
      window.parent.postMessage {type: \error, payload: window.error-message or ""}, plotdb-domain
    .catch (e) ->
      module.exec-error = true
      thread.dec reboot
      return error-handling e
  catch e
    thread.dec reboot
    error-handling e
  brand-new := false

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
  ), 400

window.addEventListener \keydown, (e) ->
  if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
    window.parent.postMessage {type: \alt-enter}, plotdb-domain

window.parent.postMessage {type: \loaded}, plotdb-domain

# dont enable it for now
/*
hover-box = document.createElement("div")
hover-box.setAttribute("class", "hover-box")
document.body.appendChild(hover-box)
hover-margin = document.createElement("div")
hover-margin.setAttribute("class", "hover-margin")
document.body.appendChild(hover-margin)
html = document.querySelector("html")
window.addEventListener \mousemove, (e) ->
  rect = e.target.getBoundingClientRect!
  scroll = top: (document.body.scrollTop or html.scrollTop), left: (document.body.scrollLeft or html.scrollTop)
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
