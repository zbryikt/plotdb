plotdb.view = do
  host: "#{plConfig.urlschema}#{plConfig.domainIO}"
  loader: (key, cb) ->
    req = new XMLHttpRequest!
    req.onload = ->
      try
        cb JSON.parse(@responseText)
      catch e
        console.error "load chart #key failed when parsing response: "
        console.error e
    req.open \get, "#{@host}/d/chart/#key", true
    req.send!

  render: ({root, chart, theme, fields}, cb) ->
    if chart => chart = eval(chart.code.content) <<< chart
    if theme => theme = eval(theme.code.content) <<< theme
    fieldhash = d3.map fields, -> it.key
    root.setAttribute("class", (root.getAttribute("class")
      .split(" ").filter(->it!=\pdb-root) ++ <[pdb-root]>).join(" "))
    root.innerHTML = [
      "<style type='text/css'>/* <![CDATA[ */#{chart.style.content}/* ]]> */</style>" if chart and chart.style
      "<style type='text/css'>/* <![CDATA[ */#{theme.style.content}/* ]]> */</style>" if theme and theme.style
      "<div style='position:relative;width:100%;height:100%;'>"
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
    if cb => setTimeout (-> cb {root, chart, theme, fields}), 0

plotdb.load = ({root, chart}, cb) ->
  if typeof(chart) == \object =>
    plotdb.view.render {
      root: root
      chart: chart.chart
      theme: chart.theme
      fields: chart.fields
    }, cb
  else if typeof(chart) == \number =>
    plotdb.view.loader chart,((r) ->
      plotdb.view.render {
        root: root
        chart: r
      }, cb
    )
