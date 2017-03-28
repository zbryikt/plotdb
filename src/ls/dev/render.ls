plotdb-domain = "http://localhost/"
send-msg = (msg) -> window.parent.postMessage msg, plotdb-domain 
loadscript = (lib, url) -> new Promise (res,rej) ->
  node = document.createElement \script
    ..type = \text/javascript
    ..src = url
    ..onload = -> res lib
  document.head.appendChild node

loadlib = (payload) ->
  head = document.getElementsByTagName("head")[0]
  if !([k for k of (payload.library or {})].length) =>
    payload.{}library['legacy/0.0.1'] = "#{plotdb-domain}/js/pack/legacy.js"
  promise = Promise.each [{lib,url} for lib,url of payload.library], (d) -> loadscript(d.lib, d.url)

store = {code: {}}

error-handling = (e, lineno = 0) ->
  /*
  msg = if store.code.url => if e.error.stack => "line #{e.lineno}: " + that.split(store.code.url).join("line ")
  else "line #{e.lineno}: #{e.message}"
  error-handling msg, e.lineno
  */
  if !e => msg = "failed with unknown error"
  else if typeof(e) != typeof({}) => msg = "#e"
  else if !e.stack => msg = e.toString!
  else msg = e.stack

  re-bloburl = /blob:http%3A\/\/[^:]+:/
  if re-bloburl.exec(msg) => msg = msg.split re-bloburl .join "line "
  if !lineno =>
    ret = /line (\d+):\d+/.exec(msg)
    lineno = if ret => parseInt(ret.1) else 0

  if msg.length > 1024 => msg = msg.substring(0,1024) + "..."
  lines = msg.split(\\n)
  if lines.length > 4 => msg = lines.splice(0,4).join(\\n)
  window.parent.postMessage {type: \error, payload: {msg, lineno}}, plotdb-domain

window.addEventListener \error, (e) -> error-handling e.error, e.lineno

proper-eval = (src) -> new Promise (res, rej) ->
  code = if src.trim!0 == \{ => "(function() { store.module = #src;})()"
  else "(function() { #src; store.module = {}; })()"
  script = document.createElement("script")
  script.onload = ->
    URL.revokeObjectURL script.src
    res store.module
    document.body.removeChild script
  script.src = store.{}code.url = URL.createObjectURL new Blob [code], {type: "text/javascript"}
  document.body.appendChild script

dispatcher = (evt) ->
  if evt.data.type == \init =>
    obj = JSON.parse(evt.data.src)
    loadlib evt.data .then ->
      proper-eval obj.code.content
    .then (module) ->
      store.chart = chart = new plotdb.view.chart(obj)
      chart.attach 'body > div:first-of-type', {}
      send-msg { type: \inited, dimension: JSON.stringify(chart._.chart.dimension) }
      plotdb.chart.get-sample-data module
      data = plotdb.chart.fields-from-dimension module.dimension
      send-msg {type: \sample-data, data: data}
  if evt.data.type == \render =>
  if evt.data.type == \snapshot => snapshot evt.data.format
  if evt.data.type == \update-data =>
    chart = store.chart
    chart.data evt.data.data, true
    
  if evt.data.type == \get-sample-data =>
    chart = store.module
    if !chart => return
    plotdb.chart.get-sample-data chart
    data = plotdb.chart.fields-from-dimension chart.dimension
    window.parent.postMessage {type: \sample-data, data: data}, plotdb-domain 
window.addEventListener \message, dispatcher, false

snapshot = (format='snapshot') ->
  try
    Array.from(document.querySelectorAll('body > div:first-of-type svg')).forEach((node)->
      {width, height} = node.getBoundingClientRect!
      node
        ..setAttribute "xmlns", "http://www.w3.org/2000/svg"
        ..setAttribute "xmlns:xlink", "http://www.w3.org/1999/xlink"
        ..setAttribute "width", width
        ..setAttribute "height", height
    )
    allsvg = document.querySelectorAll('body > div:first-of-type svg')
    if allsvg.length > 1 =>
      list = Array.from(allsvg).map ->
        box = it.getBoundingClientRect!
        [it.cloneNode(true), (box.right - box.left) * (box.bottom - box.top), it]
      list.sort (a,b) -> b.1 - a.1
      for i from 1 til list.length =>
        g = document.createElementNS("http://www.w3.org/2000/svg", "g")
        g.appendChild(list[i].0)
        list.0.0.insertBefore g, list.0.0.childNodes[0]
        box = list[i].2.getBoundingClientRect!
        g.setAttribute("transform", "translate(#{box.left},#{box.top})")
      svgnode = list.0.0
    else svgnode = (document.querySelector 'body > div:first-of-type svg').cloneNode(true)
    styles = svgnode.querySelectorAll("style")
    for idx from 0 til styles.length
      style = styles[idx]
      if !style.generated => continue
      svgnode.removeChild(style)
    # this insert styles into svg everytime.
    # yet cloneNode(true) on svgnode will fail the png generation
    styles = document.querySelectorAll('html style')
    for idx from styles.length - 1 to 0 by -1
      style = styles[idx].cloneNode(true)
      style.generated = true
      svgnode.insertBefore style, svgnode.childNodes.0
    {width, height} = svgnode.getBoundingClientRect!
    inline-style = svgnode.getAttribute(\style)
    svgnode.setAttribute(\style,
      inline-style + ";" + document.querySelector("body > div:first-of-type > div").getAttribute(\style)
    )
    svgnode.setAttribute(\xmlns, "http://www.w3.org/2000/svg")
    svgnode.setAttribute(\xmlns:xlink, "http://www.w3.org/1999/xlink")
    {width, height} = svgnode.getBoundingClientRect!
    if !width or !height =>
      width = +(svgnode.getAttribute("width") or 0) or +((svgnode.style.width or "").replace(/[^0-9]+$/,""))
      height = +(svgnode.getAttribute("height") or 0) or +((svgnode.style.height or "").replace(/[^0-9]+$/,""))

    ##### FOR High Resolution ( > 4000 ) Png
    if format == \png-hd
      if width > 1920 or height > 1920 =>
        width = Math.round(width * 2.1)
        height = Math.round(height * 2.1)
      else
        rate = 4000 / (( if height > width => width else height) or 1)
        width = width * rate
        height = height * rate
      svgnode.setAttribute("width", width)
      svgnode.setAttribute("height", height)
    #####

    Array.from(svgnode.querySelectorAll(\*)).forEach ->
      if it.style.opacity == 0 or it.getAttribute(\opacity) == 0 or
      it.getAttribute(\display) == \none or it.style.display == \none => it.parentNode.removeChild it

    svg = svgnode.outerHTML

    rgba-percent-to-value = (text) ->
      re = new RegExp([
        "([a-zA-Z-]+)\\s*" # attr name
        "([=:]?)\\s*(['\"]?)\\s*" # token
        "rgba\\(\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+%?)\\s*,\\s*([0-9.]+)\\s*\\)\\s*\\3"
      ].join(""))
      str = "#{text}"
      while true
        ret = re.exec str
        if !ret => break
        des = [
          ret.1, (if ret.2 == \: => ':#' else '="#'),
          [ret.4, ret.5, ret.6].map(->
            if it[* - 1] == \%  => v = Math.round((it.substring(0,it.length - 1)) * 2.55).toString(16)
            else v = Math.round(+it).toString(16)
            if v.length < 2 => return "0#v" else v
          ).join(''),
          (if ret.2 == \: => ';' else '" '), ret.1, '-opacity',
          (if ret.2 == \: => ':' else '="'), ret.7,
          (if ret.2 == \: => '' else '"')
        ].join("")
        text = text.replace ret.0, des
        str = str.substring(ret.index + ret.1.length)
      return text

    svg = rgba-percent-to-value svg
    svgnode.setAttribute(\style, inline-style)
    if format == \svg => return send-msg {type: \snapshot, format: \svg, payload: svg}
    img = new Image!
    img.onload = ->
      #newHeight = (if height > width => width else height ) #TODO crop image in server / service
      canvas = document.createElement("canvas") <<< {width, height}
      canvas.getContext \2d .drawImage img, 0, 0, width, height, 0, 0, width, height
      send-msg {type: \snapshot, format: format, payload: canvas.toDataURL!}
    # btoa doesn't work for utf-8 string
    encoded = base64.encode(utf8.encode(svg))
    img.src = "data:image/svg+xml;charset=utf-8;base64," + encoded
  catch e
    console.log e
    send-msg {type: \snapshot, format: format, payload: null}
