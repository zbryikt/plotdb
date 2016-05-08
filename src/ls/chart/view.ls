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

  resize = ->
    if resize.handle => clearTimeout resize.handle
    resize.handle = setTimeout (~>
      resize.handle = null
      chart.resize!
      chart.render!
    ), 500

  window.addEventListener \resize, (-> resize! )
  {root, chart, theme, fields}
