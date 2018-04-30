plotdb.view = do
  host: "#{plConfig.urlschema}#{plConfig.domain}"
  loader: (key, cb) ->
    req = new XMLHttpRequest!
    req.onload = ->
      try
        ret = JSON.parse(@responseText)
        if Array.isArray(ret) => cb(ret.map(->new plotdb.view.chart(it, {})))
        else cb(new plotdb.view.chart(ret,{}))
      catch e
        console.error "load chart #key failed when parsing response: "
        console.error e
    if typeof(key) == \number => req.open \get, "#{@host}/d/chart/#key", true
    else if typeof(key) == \string => req.open \get, key, true
    req.send!
  # parse base chart object from database
  chart: (chart, {theme, fields, root, data, code}={}) ->
    @_ = {handler: {}, _chart: JSON.stringify(chart), fields, root, inited: false, config: null}
    if chart =>
      if !code => code = chart.code.content
      if typeof(code) == \string =>
        if code.0 == \{ => code = "(function() { return #code; })();"
        else code = "(function() { #code; return module.exports; })();"
        # delete null dimension so it wont overwrite the dimension from code
        if !chart.dimension => delete chart.dimension
        @_.chart = chart = eval(code) <<< chart
      else
        @_.chart = chart = code <<< chart
        @_.code = code
    @_.config = chart.config # for tracking original config object
    if !chart.dimension and chart.{}code.{}content.dimension => chart.dimension = chart.code.content.dimension
    plotdb.chart.update-dimension chart
    plotdb.chart.update-config chart, chart.config
    plotdb.chart.update-assets chart, chart.assets
    if data => @data data
    if fields => @sync fields
    if !data and (!fields? or !fields.length) => @data chart.sample
    if theme? => @theme theme
    if fields? => @sync fields
    if root => @attach root
    chart.save-local = ((chart, key) -> (cb) ->
      req = new XMLHttpRequest!
      req.onload = -> if cb => cb!
      req.open \put, "#{plConfig.urlschema}#{plConfig.domain}/e/chart/#key/local", true
      req.setRequestHeader \Content-Type, "application/json;charset=UTF-8"
      req.send JSON.stringify(chart.local)
    ) chart, chart.key
    eventbus = {in: {}, out: {}}
    chart.fire = (name, payload) -> eventbus.out[][name].forEach -> it(payload)
    @fire = (name, payload) -> eventbus.in[][name].forEach -> it(payload)
    @handle = (name, cb) -> eventbus.out[][name].push cb
    chart.handle = (name, cb) -> eventbus.in[][name].push cb

    @

plotdb.view.chart.prototype <<< do
  update: -> <[resize bind render]>.map ~> if @_.chart[it] => @_.chart[it]!
  loadlib: (root) ->
    libs = @_.chart.library or []

  attach: (root) ->
    if typeof(root) == \string => root = document.querySelector(root)
    @_.root = oroot = root
    {chart, theme} = @_.{chart,theme}
    root.setAttribute("class", ((root.getAttribute("class") or "")
      .split(" ").filter(->it!=\pdb-root) ++ <[pdb-root]>).join(" "))
    if chart.metashow =>
      [head,foot,iroot,iiroot] = [0,0,0,0].map(->document.createElement("div"))
      iroot.appendChild(iiroot)
      iroot.style <<< {position:"absolute",left:"0",right:"0"}
      iiroot.style <<< {width: "100%",height: "100%"}
      foot.style <<< {position:"absolute",bottom: "0"}
      [head, iroot, foot].map -> root.appendChild(it)
      margin =( chart.config.margin or 10 )
      margin-vertical = if margin - 10 > 10 => margin - 10 else margin/2
      head.style <<< do
        position: "relative"
        "z-index": 999
        "text-align": \center
        margin: "#{margin-vertical}px 0 0"
        "font-family": (chart.config.fontFamily or "initial")
      foot.style <<< do
        left: "#{margin}px"
        bottom: "#{margin-vertical}px"
      head.innerHTML = [
        "<h2 style='margin:0'>#{chart.name}</h2>"
        "<p style='margin:0'>#{chart.description}</p>"
      ].join("")
      if chart.footer => foot.innerHTML = "<small>#{chart.footer}</small>"
      iroot.style <<< do
        top: head.getBoundingClientRect!height + "px"
        bottom: foot.getBoundingClientRect!height + "px"
      root = iiroot

    root.innerHTML = [
      "<style type='text/css'>/* <![CDATA[ */#{chart.{}style.content or ""}/* ]]> */</style>" if chart and chart.style
      "<style type='text/css'>/* <![CDATA[ */#{theme.{}style.content or ""}/* ]]> */</style>" if theme and theme.style
      "<div style='position:relative;width:100%;height:100%;'><div style='height:0;'>&nbsp;</div>"
      chart.{}doc.content or ""
      "</div>"
      theme.{}doc.content if theme and theme.{}doc.content
    ].join("")
    chart.root = root.querySelector("div:first-of-type")
    resize = ->
      if resize.handle => clearTimeout resize.handle
      resize.handle = setTimeout (~>
        resize.handle = null
        if chart.resize => chart.resize!
        if chart.render => chart.render!
      ), 10
    plotdb.util.trackResizeEvent root, (-> resize!)
    newClass = (oroot.getAttribute(\class) or "").split(' ').filter(->it!='loading').join(" ").trim!
    try
      if chart.init => chart.init!
      if chart.parse => chart.parse!
      if chart.resize => chart.resize!
      if chart.bind => chart.bind!
      if chart.render => chart.render!
    catch e
      newClass += ' error'
      console.error e
    oroot.setAttribute \class, newClass
    @inited = true
  config: (n, update = false, rebind) ->
    chart = @_.chart
    chart.config <<< n
    if !update => return
    [o,b] = [chart.config, @_.config]
    rebind = if rebind? => rebind else [[k,v] for k,v of n].filter(~> o[k] != v and b[k].rebindOnChange)
    chart.parse! if rebind
    chart.resize!
    chart.bind! if rebind
    chart.render!
  init: (root) -> @_.chart.init!
  parse: -> @_.chart.parse!
  resize: -> @_.chart.resize!
  bind: -> @_.chart.bind!
  render: -> @_.chart.render!
  destroy: -> if @_.chart.destroy => @_.chart.destroy!
  clone: ->
    code = null
    # to create a new code object yet keep all functions available
    if @_.code and typeof(@_.code) == \object =>
      code = {}
      for k,v of @_.code => if typeof(v) == typeof(->) => code[k] = v
    new plotdb.view.chart(JSON.parse(@_._chart), {} <<< @_{theme, fields} <<< {code})
  on: (event, cb) -> @_.handler[][event].push cb
  theme: (theme) -> @_.theme = eval(theme.code.content) <<< theme
  refresh: ->
    @_.chart.parse!
    @_.chart.resize!
    @_.chart.bind!
    @_.chart.render!

  # we accpet:
  #   [{}, {}, ...]               - data array
  #   {order: [{},{}...], ...}    - field array
  #   {order: {fields: ...}, ...} - dimension
  data: (data, refresh, mapping) ->
    if !data? => return @_.data
    if mapping => data = plotdb.chart.data-convert.by-mapping data, mapping
    if !Array.isArray(data) and typeof(data) == typeof({}) =>
      key = [k for k of data].0
      if !Array.isArray(data[key]) => data = plotdb.chart.data-convert.from-dimension data
    @_.data = data
    @sync!
    if @inited and refresh => @refresh!
  sync: (fields = []) ->
    if @_.data => return @_.chart.data = plotdb.chart.data-from-hash @_.chart.dimension, @_.data
    hash = {}
    for item in fields => hash[item.key] = item
    for k,v of @_.chart.dimension =>
      v.fields = (v.fields or []).map(->hash[it.key]).filter(->it)
    plotdb.chart.update-data @_.chart
    if @inited and @_.chart.parse => @_.chart.parse!


plotdb.load = (key, cb) ->
  plotdb.view.loader key, cb

plotdb.render = (config, cb) ->
  plotdb.view.render config, cb
