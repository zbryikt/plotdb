plotdomain = \http://localhost
render = (chart) ->
  root = document.getElementById \container
  config = chart.config
  data = chart.data
  chart = window.module.exports
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
  window.parent.postMessage {type: \error, payload: window.error-message or ""}, plotdomain
