sched = do
  timeout: do
    list: []
    func: window.setTimeout
    set: (func, delta) -> @func.call null, func, delta
  interval: do
    list: []
    func: window.setInterval
    set: (func, delta) -> @func.call null, func, delta
  clear: ->
    for item in @timeout.list => clearTimeout item
    for item in @interval.list => clearInterval item

# Chrome refuse to use setInterval in dictionary like ...sched.interval

window.setTimeout = (func, delta) ->
  ret = sched.timeout.set func, delta
  sched.timeout.list.push ret
  ret

window.setInterval = (func, delta) ->
  ret = sched.interval.set func, delta
  sched.interval.list.push ret
  ret

<- $ document .ready

plotdomain = \http://localhost/
dispatcher = (evt) ->
  if evt.data.type == \snapshot => snapshot!
  else if evt.data.type == \render => render evt.data.payload, evt.data.rebind
  else if evt.data.type == \parse => parse evt.data.payload

error-handling = (e) ->
  if !e => payload = "plot failed with unknown error"
  else if typeof(e) != typeof({}) => payload = "#e"
  else if !e.stack => payload = e.toString!
  else payload = e.stack
  if payload.length > 1024 => payload = payload.substring(0,1024) + "..."
  lines = payload.split(\\n)
  if lines.length > 4 => payload = lines.splice(0,4).join(\\n)
  window.parent.postMessage {type: \error, payload}, plotdomain

parse = (payload) ->
  try
    eval(payload)
    chart = module.exports
    payload = JSON.stringify({} <<< chart{dimension, config})
    window.parent.postMessage {type: \parse, payload}, plotdomain
  catch e
    error-handling e

snapshot = ->
  canvas = document.createElement \canvas
  document.body.appendChild(canvas)
  svg = document.getElementById \container .innerHTML
  canvg canvas, svg
  result = canvas.toDataURL!
  window.parent.postMessage {type: \snapshot, payload: result}, plotdomain

render = (payload, rebind = true) ->
  code = payload.code.content
  style = payload.style.content
  doc = payload.doc.content
  data = payload.data
  config = payload.config or {}
  sched.clear!
  try
    if rebind =>
      $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
      window.module = {}
      eval(code)
      window.module = module
    root = document.getElementById \container
    chart = module.exports
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
    if rebind =>
      if chart.init => chart.init root, data, config
      chart.bind root, data, config
    chart.resize root, data, config
    chart.render root, data, config
    window.parent.postMessage {type: \error, payload: ""}, plotdomain
  catch e
    error-handling e

window.addEventListener \message, dispatcher, false

window.addEventListener \keydown, (e) ->
  if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
    window.parent.postMessage {type: \alt-enter}, plotdomain

window.parent.postMessage {type: \loaded}, plotdomain
