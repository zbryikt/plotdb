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
  fields-from-dimension: (dimension) ->
    [[k,v] for k,v of dimension].map((d)->
      d.1.fields.map -> it.bind = d.0
      d.1.fields
    ).reduce(((a,b) -> a ++ b), [])
  data-from-dimension: (dimension) ->
    [parsers,data] = [{},[]]
    len = Math.max.apply null,
      [v for k,v of dimension]
        .reduce(((a,b) -> (a) ++ (b.fields or [])),[])
        .filter(->it.data)
        .map(->it.data.length) ++ [0]
    for k,v of dimension
      if v.multiple => v.field-name = v.[]fields.map -> it.name
      else v.field-name = if v.[]fields.0 => that.name else null
      for field in v.[]fields =>
        if !field.datatype => field.datatype = plotdb.Types.resolve(field.data)
      default-parser = plotdb{}[(v.[]type[0] or {}).name].parse or null
      parsers[k] = if v.fields.length =>
        v.fields.map(->default-parser or plotdb{}[it.datatype].parse or (->it))
      else [default-parser or (->it)]
    for i from 0 til len =>
      ret = {}
      for k,v of dimension
        if v.[]fields.length => ret[k] = v.[]fields.map(->it.[]data[i])
        else
          ret[k] = [[v.type.0 or plotdb.String].default]
          if typeof(ret[k]) == \function => ret[k] = ret[k] k,v,i
        for j from 0 til (ret[k] or []).length =>
          ret[k][j] = parsers[k][j](ret[k][j])
        if !v.multiple => ret[k] = ret[k].0
      data.push ret
    return data
  data-convert: do
    from-dimension: (dimension) ->
      ret = {}
      for k,v of dimension => ret[k] = v.fields
      ret
    by-mapping: (data, mapping) ->
      ret = {}
      for k,v of mapping =>
        ret[k] = [{
          name: name
          data: data.map -> it[name]
        } for name in v]
      ret
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
  update-config: (chart, config) -> # deprecated: replace with chart.config.update ? 
    for k,v of chart.config =>
      type = (chart.config[k].type or []).map(->it.name)
      if !(config[k]?) => config[k] = v.default
      else if !(config[k].value?) => config[k] = (v or config[k]).default
      else config[k] = config[k].value
      if type.0 and plotdb[type.0].parse =>
        config[k] = plotdb[type.0].parse config[k]
      #if type.filter(->it == \Number).length => config[k] = parseFloat(config[k])
  add: (name, json) -> plotdb.chart.add.{}list[name] = json
  get: (name) ->
    chart = plotdb.chart.add.{}list[name]
    if !chart => return null
    code = chart.code.content
    chart = JSON.parse(JSON.stringify(chart))
    if typeof(code) != \string => chart.code.content = code
    new plotdb.view.chart chart
  list: -> [k for k of plotdb.chart.add.list]

plotdb.chart.config = do
  # parse config object into {k:v} config
  update: (config) ->
    ret = @parse(@preset config)
    for k,v of ret => config[k] = v
  # extend config object with extension
  preset: (config) ->
    for k,v of (config or {}) =>
      if config[v.extend] => p = config[v.extend]
      else if plotdb.config[v.extend] => p = plotdb.config[v.extend]
      else if plotdb.config[k] => p = plotdb.config[k]
      else continue
      for f,val of p => if !(v[f]?) => v[f] = val
    config
  # generate {k:v} config from config object
  parse: (config) ->
    ret = {}
    for k,v of (config or {}) =>
      if !(v?) => config[k] = {}
      if !(v.value?) => v.value = v.default or 0
      for type in (v.type or [])=>
        try
          type = plotdb[type.name]
          if type.test and type.parse and type.test(v.value) =>
            v.value = type.parse v.value
            break
        catch e
          console.log "chart config: type parsing exception ( #k / #type )"
          console.log "#{e.stack}"
      ret[k] = config[k].value
    ret
