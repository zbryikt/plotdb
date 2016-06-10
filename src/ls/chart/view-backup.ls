plotdb.view = do
  host: "#{plConfig.urlschema}#{plConfig.domainIO}"
  loader: (key, cb) ->
    req = new XMLHttpRequest!
    req.onload = ->
      try
        cb plotdb.view.chart(JSON.parse(@responseText))
      catch e
        console.error "load chart #key failed when parsing response: "
        console.error e
    if typeof(key) == \number => req.open \get, "#{@host}/d/chart/#key", true
    else if typeof(key) == \string => req.open \get, key, true
    req.send!

  chart2: (chart) ->
    if chart => chart = eval(chart.code.content) <<< chart
    plotdb.chart.update-config chart, chart.config
    plotdb.chart.update-assets chart, chart.assets
    chart.set-data = ->
    chart.update = ->
      if chart.parse => chart.parse!
      chart.resize!
      chart.bind!
      chart.render!

    chart.attach = ({root, theme, fields, data, config}, cb) ->
      #if chart => chart = eval(chart.code.content) <<< chart
      if theme => theme = eval(theme.code.content) <<< theme
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
      fieldhash = d3.map fields, -> it.key
      if !data => 
        for k,v of chart.dimension =>
          v.fields = (v.fields or []).map(->fieldhash.get(it.key)).filter(->it)
          v.fields.forEach -> if (v.type or []).filter(->it.name == \Number).length =>
            it.data = it.data.map -> parseFloat(it)
        plotdb.chart.update-data chart
        chart.data = plotdb.chart.get-sample-data chart
      else => 
        if typeof(data) == \function =>
          chart.sample = data
          chart.data = plotdb.chart.get-sample-data chart
          console.log chart.data
        else chart.data = data
      #plotdb.chart.update-config chart, chart.config
      chart.config <<< config
      #plotdb.chart.update-assets chart, chart.assets
      chart.root = root.querySelector("div:first-of-type")
      chart.init!
      if chart.parse => chart.parse!
      chart.resize!
      chart.bind!
      chart.render!
      root.setAttribute(
        \class
        (root.getAttribute(\class) or "").split(' ').filter(->it!='loading').join(" ").trim!
      )
      resize = ->
        if resize.handle => clearTimeout resize.handle
        resize.handle = setTimeout (~>
          resize.handle = null
          chart.resize!
          chart.render!
        ), 500
      window.addEventListener \resize, (-> resize! )
      # call cb later to let everything be prepared
      if cb => setTimeout (-> cb {root, chart, theme, fields, config, data}), 0

    chart

  render2: ({root, chart, theme, fields, data, config}, cb) ->
    #if chart => chart = eval(chart.code.content) <<< chart
    if theme => theme = eval(theme.code.content) <<< theme
    fieldhash = d3.map fields, -> it.key
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
    if !data => 
      for k,v of chart.dimension =>
        v.fields = (v.fields or []).map(->fieldhash.get(it.key)).filter(->it)
        v.fields.forEach -> if (v.type or []).filter(->it.name == \Number).length =>
          it.data = it.data.map -> parseFloat(it)
      plotdb.chart.update-data chart
      chart.data = plotdb.chart.get-sample-data chart
    else => 
      if typeof(data) == \function =>
        chart.sample = data
        chart.data = plotdb.chart.get-sample-data chart
        console.log chart.data
      else chart.data = data
    #plotdb.chart.update-config chart, chart.config
    chart.config <<< config
    #plotdb.chart.update-assets chart, chart.assets
    chart.root = root.querySelector("div:first-of-type")
    chart.init!
    chart.resize!
    chart.bind!
    chart.render!
    root.setAttribute(
      \class
      (root.getAttribute(\class) or "").split(' ').filter(->it!='loading').join(" ").trim!
    )
    resize = ->
      if resize.handle => clearTimeout resize.handle
      resize.handle = setTimeout (~>
        resize.handle = null
        chart.resize!
        chart.render!
      ), 500
    window.addEventListener \resize, (-> resize! )
    # call cb later to let everything be prepared
    if cb => setTimeout (-> cb {root, chart, theme, fields, config, data}), 0

plotdb.view.chart = (chart, {theme, fields, root})->
  @_ = {handler: {}, chart, fields, root,  inited: false}
  if chart => 
    delete chart.config
    delete chart.assets
    chart = eval(chart.code.content) <<< chart
  plotdb.chart.update-config chart, chart.config
  plotdb.chart.update-assets chart, chart.assets
  @theme theme
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
    @_.chart.parse!


plotdb.load = (key, cb) ->
  plotdb.view.loader key, cb

plotdb.render = (config, cb) ->
  plotdb.view.render config, cb

/*
plotdb.load = ({root, chart}, cb) ->
  if typeof(chart) == \object =>
    if chart.chart =>
      plotdb.view.render {
        root: root
        chart: chart.chart
        theme: chart.theme
        fields: chart.fields
      }, cb
    else if root => 
      plotdb.view.render {
        root: root
        chart: chart
      }, cb
  else if typeof(chart) == \number or typeof(chart) == \string =>
    plotdb.view.loader chart,((r) ->
      if root => plotdb.view.render {
          root: root
          chart: r
        }, cb
      else cb
    )
  else => throw new Error("plotdb.load is invoked with a non-supported chart type")
*/
