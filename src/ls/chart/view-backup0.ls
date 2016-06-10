
plotdb.view.chart = (chart, {theme, fields, root, ...})->
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
    #for k,v of chart.dimension =>
    #  v.fields = (v.fields or []).map(->hash.get(it.key)).filter(->it)
    #  v.fields.forEach -> if (v.type or []).filter(->it.name == \Number).length =>
    #    it.data = it.data.map -> parseFloat(it)

    #chart.attach = ({root, theme, fields, data, config}, cb) ->

      #theme
      #if theme => theme = eval(theme.code.content) <<< theme

      #dom - one time effort
      
      #root.setAttribute("class", ((root.getAttribute("class") or "")
        #.split(" ").filter(->it!=\pdb-root) ++ <[pdb-root]>).join(" "))
      #root.innerHTML = [
        #"<style type='text/css'>/* <![CDATA[ */#{chart.style.content}/* ]]> */</style>" if chart and chart.style
        #"<style type='text/css'>/* <![CDATA[ */#{theme.style.content}/* ]]> */</style>" if theme and theme.style
        #"<div style='position:relative;width:100%;height:100%;'><div style='height:0;'>&nbsp;</div>"
        #chart.doc.content
        #"</div>"
        #theme.doc.content if theme and theme.{}doc.content
      #].join("")
      ##resize handler
      #resize = ->
        #if resize.handle => clearTimeout resize.handle
        #resize.handle = setTimeout (~>
          #resize.handle = null
          #chart.resize!
          #chart.render!
        #), 500
      #window.addEventListener \resize, (-> resize! )

      #data
      #fieldhash = d3.map fields, -> it.key
      #if !data => 
        #for k,v of chart.dimension =>
          #v.fields = (v.fields or []).map(->fieldhash.get(it.key)).filter(->it)
          #v.fields.forEach -> if (v.type or []).filter(->it.name == \Number).length =>
            #it.data = it.data.map -> parseFloat(it)
        #plotdb.chart.update-data chart
        #chart.data = plotdb.chart.get-sample-data chart
      #else => 
        #if typeof(data) == \function =>
          #chart.sample = data
          #chart.data = plotdb.chart.get-sample-data chart
          #console.log chart.data
        #else chart.data = data

      #config
      #chart.config <<< config

      #dom
      #chart.root = root.querySelector("div:first-of-type")

      #init and render
      #chart.init!
      #if chart.parse => chart.parse!
      #chart.resize!
      #chart.bind!
      #chart.render!

      #finalize
      #root.setAttribute(
      #  \class
      #  (root.getAttribute(\class) or "").split(' ').filter(->it!='loading').join(" ").trim!
      #)

      # call cb later to let everything be prepared
      #if cb => setTimeout (-> cb {root, chart, theme, fields, config, data}), 0

