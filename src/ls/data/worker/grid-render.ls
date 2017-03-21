grid-render = (e) ->
  htmlCharMap = '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  escape = (text="") -> "#text".replace /[&<>"']/g, (m) -> htmlCharMap[m]
  data = e.data
  rowcount = data.rowcount or 10
  types = data.types or []
  ohlen = data.headers.length
  rlen = head: data.headers.length, rows: data.[]rows.length
  len = do
    head: (if data.headers.length < rowcount => rowcount else data.headers.length + 1)
    rows: (if data.[]rows.length < 100 => 100 else data.rows.[]length + 10)
  headers = [data.headers[i] or '' for i from 0 til len.head]
  w = "#{100/len.head}%"
  if  len.head > 10 => w = "10%"
  ths = "<div>" + headers.map((d,i)->
    [
      "<div style='width:#w' col='#i'>"
      "<div contenteditable='true' col='#i' class='#{if i<ohlen => 'in-use' else ''}'>"
      (if d => "&nbsp;#{escape(d)}" else => "")
      "</div><small class='grayed' col='#i'>&nbsp;"
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
    ["<div class='dropdown' col='#j' style='width:#w'>"
    "<div class='dropdown-toggle' data-toggle='dropdown'><span></span><span class='caret'></span></div>"
    "<ul class='dropdown-menu'>"
    "</ul>"
    "</div>"].join("")
  ).join("") + "</div>"
  for i from 0 til len.rows
    trs.push "<div>" + headers.map((d,j)->
      "<div contenteditable='true' row='#i' col='#j' style='width:#w'>" +
      (escape((data.rows[i] or [])[j]) or '') +
      "</div>"
    ).join("") + "</div>"
  return {trs, ths, dim}
