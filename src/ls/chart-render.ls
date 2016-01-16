<- $ document .ready

render = (evt) ->
  code = evt.data.code.content
  style = evt.data.style.content
  doc = evt.data.doc.content
  data = evt.data.data
  config = evt.data.config or {}
  $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
  window.module = {}
  eval(code)
  root = document.getElementById \container
  chart = module.exports
  for k,v of chart.config => config[k] = if !(config[k].value?) => v.default else config[k].value
  chart.bind root, data, config
  chart.resize root, data, config
  chart.render root, data, config
window.addEventListener \message, render, false

