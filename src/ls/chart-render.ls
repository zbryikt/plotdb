<- $ document .ready

dispatcher = (evt) ->
  if evt.data.type == \snapshot => snapshot!
  else if evt.data.type == \render => render evt.data.payload

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
  $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
  window.module = {}
  eval(code)
  root = document.getElementById \container
  chart = module.exports
  for k,v of chart.config => 
    config[k] = if !(config[k]?) or !(config[k].value?) => v.default else config[k].value
  for k,v of config => if /^[0-9.+-]+$/.exec(v) => config[k] = parseFloat(v)
  if chart.init => chart.init root, data, config
  chart.bind root, data, config
  chart.resize root, data, config
  chart.render root, data, config
window.addEventListener \message, dispatcher, false

