plotdomain = \http://localhost
plotdb.viewer = do
  render: (payload) ->
    chart = module.exports
    assets = payload.assets
    data = payload.data
    config = payload.config or {}
    root = document.getElementById \container
    if (!data or !data.length) and chart.sample => data = chart.sample
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
    chart <<< {config,root,data}
    if chart.init => chart.init!
    module.inited = true
    if chart.bind => chart.bind!
    chart.resize!
    chart.render!

  resize: ->
    if @resize.handle => clearTimeout @resize.handle
    @resize.handle = setTimeout (~>
      @resize.handle = null
      chart = module.exports
      chart.resize!
      chart.render!
    ), 500

window.addEventListener \resize, (->plotdb.viewer.resize!)
