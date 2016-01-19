<- $ document .ready

dispatcher = (evt) ->
  if evt.data.type == \snapshot => snapshot!
  else if evt.data.type == \render => render evt.data.payload
  else if evt.data.type == \parse => parse evt.data.payload

parse = (payload) ->
  try
    eval(payload)
    chart = module.exports
    payload = JSON.stringify({} <<< chart{mapping, config})
    window.parent.postMessage {type: \parse, payload}, \http://localhost/

snapshot = ->
  canvas = document.createElement \canvas
  document.body.appendChild(canvas)
  svg = document.getElementById \container .innerHTML
  canvg canvas, svg
  result = canvas.toDataURL!
  #TODO correct referrer
  window.parent.postMessage {type: \snapshot, payload: result}, \http://localhost/

render = (payload) ->
  code = payload.code.content
  style = payload.style.content
  doc = payload.doc.content
  data = payload.data
  config = payload.config or {}
  try
    $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
    window.module = {}
    eval(code)
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
    if chart.init => chart.init root, data, config
    chart.bind root, data, config
    chart.resize root, data, config
    chart.render root, data, config
    window.parent.postMessage {type: \error, payload: ""}, \http://localhost/
  catch e
    if !e => payload = "plot failed with unknown error"
    else if typeof(e) != typeof({}) => payload = "#e"
    else if !e.stack => payload = e.toString!
    else payload = e.stack
    if payload.length > 1024 => payload = payload.substring(0,1024) + "..."
    lines = payload.split(\\n)
    if lines.length > 4 => payload = lines.splice(0,4).join(\\n)
    #TODO correct referrer
    window.parent.postMessage {type: \error, payload}, \http://localhost/

window.addEventListener \message, dispatcher, false

window.addEventListener \keydown, (e) ->
  if (e.metaKey or e.altKey) and (e.keyCode==13 or e.which==13) =>
    #TODO correct referrer
    window.parent.postMessage {type: \alt-enter}, \http://localhost/
