<- $ document .ready

render = (evt) ->
  code = evt.data.code.content
  style = evt.data.style.content
  doc = evt.data.doc.content
  $(document.body).html("<style type='text/css'>#style</style><div id='container'>#doc</div>")
  console.log 1
  window.module = {}
  console.log 2
  eval(code)
  console.log 3
  root = document.getElementById \container
  data = [1,2,3,4,5]
  chart = module.exports
  config = {}
  console.log chart
  for item of chart.config => config[item] = chart.config[item].default
  chart.bind root, data, config
  chart.resize root, data, config
  chart.render root, data, config
window.addEventListener \message, render, false

