grid-render = (e) ->
  htmlCharMap = '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  escape = (text="") -> "#text".replace /[&<>"']/g, (m) -> htmlCharMap[m]
  data = e.data
  types = data.types or []
  ohlen = data.headers.length
  len = do
    head: (if data.headers.length < 10 => 10 else data.headers.length + 1)
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
  data.rows = [data.rows[i] or ['' for j from 0 til len.head] for i from 0 til len.rows]
  trs = data.rows.map (row,i) -> (
    "<div>" + headers.map((d,j)->
      "<div contenteditable='true' row='#i' col='#j' style='width:#w'>#{escape(row[j]) or ''}</div>"
    ).join("") + "</div>"
  )
  return {trs, ths}
