plotdb.view = do
  host: "#{plConfig.urlschema}#{plConfig.domainIO}"
  loader: (key, cb) ->
    req = new XMLHttpRequest!
    req.onload = ->
      try
        cb(new plotdb.view.chart(JSON.parse(@responseText),{}))
      catch e
        console.error "load chart #key failed when parsing response: "
        console.error e
    if typeof(key) == \number => req.open \get, "#{@host}/d/chart/#key", true
    else if typeof(key) == \string => req.open \get, key, true
    req.send!
  chart: (chart, {theme, fields, root, data}) ->
    @_ = {handler: {}, chart, fields, root, inited: false}
    if chart =>
      delete chart.assets
      @_.chart = chart = eval(chart.code.content) <<< chart
    plotdb.chart.update-config chart, chart.config
    plotdb.chart.update-assets chart, chart.assets
    if data => @data data
    if fields => @sync fields
    if !data and !fields => @data chart.sample
    if theme => @theme theme
    if fields => @sync fields
    if root => @attach root
    @

plotdb.view.chart.prototype <<< do
  update: -> <[resize bind render]>.map ~> if @_.chart[it] => @_.chart[it]!
  attach: (root) ->
    @_.root = root
    {chart, theme} = @_.{chart,theme}
    root.setAttribute("class", ((root.getAttribute("class") or "")
      .split(" ").filter(->it!=\pdb-root) ++ <[pdb-root]>).join(" "))
    root.innerHTML = [
      "<style type='text/css'>/* <![CDATA[ */#{chart.style.content}/* ]]> */</style>" if chart and chart.style
      "<style type='text/css'>/* <![CDATA[ */#{theme.style.content}/* ]]> */</style>" if theme and theme.style
      "<div style='position:relative;width:100%;height:100%;'><div style='height:0;'>&nbsp;</div>"
      chart.doc.content
      "</div>"
      theme.doc.content if theme and theme.{}doc.content
    ].join("")
    chart.root = root.querySelector("div:first-of-type")
    resize = ->
      if resize.handle => clearTimeout resize.handle
      resize.handle = setTimeout (~>
        resize.handle = null
        chart.resize!
        chart.render!
      ), 500
    window.addEventListener \resize, (-> resize! )
    chart.init!
    if chart.parse => chart.parse!
    chart.bind!
    chart.resize!
    chart.render!
    root.setAttribute(
      \class
      (root.getAttribute(\class) or "").split(' ').filter(->it!='loading').join(" ").trim!
    )
    @inited = true

  #auto call update ? check rebindOnChange?
  config: (config) -> @_.chart.config <<< config
  init: (root) -> @_.chart.init!
  parse: -> @_.chart.parse!
  resize: -> @_.chart.resize!
  bind: -> @_.chart.bind!
  render: -> @_.chart.render!
  clone: -> new plotdb.view.chart(@_.chart, @_)
  on: (event, cb) -> @_.handler[][event].push cb
  theme: (theme) -> @_.theme = eval(theme.code.content) <<< theme

  data: (data) ->
    if !data? => return @_.data
    @_.data = data
    @sync!
  sync: (fields = []) ->
    if @_.data => return @_.chart.data = plotdb.chart.data-from-hash @_.chart.dimension, @_.data
    hash = d3.map fields, -> it.key
    for k,v of @_.chart.dimension =>
      v.fields = (v.fields or []).map(->hash.get(it.key)).filter(->it)
    plotdb.chart.update-data @_.chart
    if @_.chart.parse => @_.chart.parse!


plotdb.load = (key, cb) ->
  plotdb.view.loader key, cb

plotdb.render = (config, cb) ->
  plotdb.view.render config, cb
