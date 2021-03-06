grid-render = (e) ->
  htmlCharMap = '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  escape = (text="") -> "#text".replace /[&<>"']/g, (m) -> htmlCharMap[m]
  data = e.data
  dimkeys = data.dimkeys or []
  bind = data.bind or []
  rowcount = data.rowcount or 10
  types = data.types or []
  ohlen = data.headers.length
  rlen = head: data.headers.length, rows: data.[]rows.length
  len = do
    head: (if data.headers.length < rowcount => rowcount else data.headers.length + 1)
    rows: (if data.[]rows.length < 100 => 100 else data.rows.[]length + 10)
  headers = [data.headers[i] or '' for i from 0 til len.head]
  w = "#{100/len.head}%"
  if  len.head > 5 => w = "20%"
  ths = "<div>" + headers.map((d,i)->
    [
      "<div style='width:#w' col='#i'>"
      #"""<input col='#i' class='#{if i<ohlen => 'in-use' else ''}' value="#d"/>"""
      """<textarea col='#i' class='#{if i<ohlen => 'in-use' else ''}'>#d</textarea>"""
      #"<div contenteditable='true' col='#i' class='#{if i<ohlen => 'in-use' else ''}'>"
      #(if d => "&nbsp;#{escape(d)}" else => "")
      #"</div><small class='grayed' col='#i'>&nbsp;"
      "<small class='grayed' col='#i'>&nbsp;"
      (if i < ohlen => (if types[i] => that else 'ANY') else '')
      "</small>"
      (if i < ohlen => "<div class='closebtn inverse' col='#i'></div>" else '')
      "</div>"
    ].join("")
  ).join("") + "</div>"
  if !data.rows => return postMessage {ths}
  data.rows = [data.rows[i] or ['' for j from 0 til rlen.head] for i from 0 til rlen.rows]
  trs = []
  dim = "<div>" + headers.map((d,j)->
    displayname = (dimkeys.filter(->it.name == bind[j]).0 or {displayname: bind[j]}).displayname
    [
      "<div class='dropdown' col='#j' style='width:#w'>"
      """<div class='dropdown-toggle' data-toggle='dropdown'>"""
      """<span>#{displayname or '<span class="grayed">(empty)</span>'}</span>"""
      """<span class='caret'></span></div>"""
      "<ul class='dropdown-menu'>"
      [ ("""<li><a href='#' data-dim="#{v.name}" """ + 
      """data-multi="#{!!v.multiple}">""" +
      """<i class='grayed fa fa-#{if v.multiple => 'clone' else 'square-o'}'></i>""" +
      """#{v.displayname}""" + 
      """<small>#{v.desc}</small>""" + 
      """</a></li>"""
      ) for v in dimkeys ].join("")
      """<li class='divider'></li>"""
      """<li class='grayed'><a href='#' data-dim="">(empty)"""
      """<small>remove from binding</small>"""
      """</a></li>"""
      """<li class='grayed'><a href='#' data-dim="" data-action="clearall">clear all"""
      """<small>clear all bindings</small>"""
      """</a></li>"""
      "</ul>"
      "</div>"
    ].join("")
  ).join("") + "</div>"
  for i from 0 til len.rows
    trs.push "<div><span class='closebtn inverse' row='#i'></span>" + headers.map((d,j)->
      [
        #"""<div style='width:#w'><input row='#i' col='#j' value="#{(data.rows[i] or [])[j] or ''}"/></div>"""
        """<div style='width:#w'><textarea row='#i' col='#j'>#{(data.rows[i] or [])[j] or ''}</textarea></div>"""
      ].join("")
      /*
      [
        "<div contenteditable='true' row='#i' col='#j' style='width:#w'>",
        (escape((data.rows[i] or [])[j]) or ''),
        "</div>"
      ].join("")
      */
    ).join("") + "</div>"
  return {trs, ths, dim}
