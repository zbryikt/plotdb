plotdb-domain = "#{window.plConfig.urlschema}#{window.plConfig.domain}"

plotdb.load = ({root,chart,theme,fields}) ->
  if chart => chart = eval(chart.code.content) <<< chart
  if theme => theme = eval(theme.code.content) <<< theme
  fieldhash = d3.map fields, -> it.key
  root.innerHTML = [
    "<style type='text/css'>/* <![CDATA[ */#{chart.style.content}/* ]]> */</style>"
    "<style type='text/css'>/* <![CDATA[ */#{theme.style.content}/* ]]> */</style>" if theme and theme.{}style.content
    "<div>"
    chart.doc.content
    "</div>"
    theme.doc.content if theme and theme.{}doc.content
  ].join("")
  for k,v of chart.dimension =>
    v.fields = v.fields.map(->fieldhash.get(it.key)).filter(->it)
    v.fields.forEach -> it.data = it.data.map -> parseFloat(it)
  plotdb.chart.update-data chart
  plotdb.chart.update-config chart, chart.config
  plotdb.chart.update-assets chart, chart.assets
  if !chart.data or !chart.data.length => chart.data = plotdb.chart.get-sample-data chart

  chart.root = root.querySelector("div:first-of-type")
  chart.init!
  chart.resize!
  chart.bind!
  chart.render!
  root.setAttribute(
    \class
    root.getAttribute(\class).split(' ').filter(->it!='loading').join(" ")
  )

'''
plotdb.viewer = do
  sample: (dimension, sample) ->
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

  render: (payload, rebind = true) ->
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
          if typeof(chart.sample) == "function" => data := plotdb.viewer.sample dimension, chart.sample!
          else if Array.isArray(chart.sample) => data := chart.sample
          else data := []
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
'''
