plotdb.chart = do
  corelib: {}
  create: (config) -> {} <<< @base <<< config
  base: do
    dimension: value: {type: [], require: false}
    config: padding: {}
    init: ->
    bind: ->
    resize: ->
    render: ->
  data-from-dimension: (dimension) ->
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
          ret[k] = if v.[]fields.length => v.[]fields.map(->it.[]data[i]) else null
          v.field-name = v.[]fields.map -> it.name
        else
          ret[k] = if v.[]fields.0 => that.[]data[i] else null
          v.field-name = if v.[]fields.0 => that.name else null
        if ret[k] == null => # not bound dimension: we fill it with default
          type = (v.type.0 or plotdb.String)
          defval = plotdb[type.name].default
          value = if (typeof(defval) == \function) => defval(k,v,i) else type.default
          ret[k] = if v.multiple => [value] else value
        if v.type and v.type.0 and plotdb[v.type.0.name].parse =>
          parse = plotdb[v.type.0.name].parse
          if Array.isArray(ret[k]) =>
            for j from 0 til ret[k].length => ret[k][j] = parse ret[k][j]
          else ret[k] = parse ret[k]
        #if (v.type or []).filter(->it.name == \Number).length =>
        #  if Array.isArray(ret[k]) => ret[k] = ret[k].map(->parseFloat(it))
        #  else ret[k] = parseFloat(ret[k])
      data.push ret
    return data
  data-from-hash: (dimension, source) ->
    if !dimension or !source => return []
    if Array.isArray(source) => return source
    if typeof(source) == \function => source = source!
    for k,v of dimension => v.fields = (source[k] or [])
    return plotdb.chart.data-from-dimension dimension
  get-sample-data: (chart, dimension = null) ->
    plotdb.chart.data-from-hash (dimension or chart.dimension), chart.sample
  update-data: (chart) ->
    #TODO abstract so that sample data in renderer can also use this. we now just copy it.
    #TODO fields data load by demand
    chart.data = plotdb.chart.data-from-dimension chart.dimension
  update-dimension: (chart) ->
    for k,v of chart.dimension => if Array.isArray(v.type) =>
      v.type = v.type.map -> if typeof(it) == \object => it else (plotdb[it] or {})
  update-assets: (chart, assets = []) ->
    ret = {}
    for file in assets =>
      raw = atob(file.content)
      array = new Uint8Array(raw.length)
      for idx from 0 til raw.length => array[idx] = raw.charCodeAt idx
      file.blob = new Blob([array],{type: file.type})
      file.url = URL.createObjectURL(file.blob)
      file.datauri = [ "data:", file.type, ";charset=utf-8;base64,", file.content ].join("")
      ret[file.name] = file
    chart.assets = ret
  update-config: (chart, config) ->
    for k,v of chart.config =>
      type = (chart.config[k].type or []).map(->it.name)
      if !(config[k]?) => config[k] = v.default
      else if !(config[k].value?) => config[k] = (v or config[k]).default
      else config[k] = config[k].value
      if type.0 and plotdb[type.0].parse =>
        config[k] = plotdb[type.0].parse config[k]
      #if type.filter(->it == \Number).length => config[k] = parseFloat(config[k])
