htmlCharMap = '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
escape = (text="") -> text.replace /[&<>"']/g, (m) -> htmlCharMap[m]

onmessage = (e) ->
  data = e.data
  if data.headers.length < 10 =>
  len = do
    head: (if data.headers.length < 10 => 10 else data.headers.length + 1)
    rows: (if data.rows.length < 100 => 100 else data.rows.length + 10)
  data.headers = [data.headers[i] or '' for i from 0 til len.head]
  data.rows = [data.rows[i] or ['' for j from 0 til len.head] for i from 0 til len.rows]
  w = "#{100/len.head}%"
  if  len.head > 10 => w = "10%"
  trs = data.rows.map (row,i) -> (
    "<div>" + data.headers.map((d,j)->
      "<div contenteditable='true' row='#i' col='#j' style='width:#w'>#{escape(row[j]) or ''}</div>"
    ).join("") + "</div>"
  )
  ths = "<div>" + data.headers.map((d,i)->
    "<div style='width:#w'><div contenteditable='true' col='#i'>&nbsp;#{escape(d)}</div>" +
    "<small class='grayed'>&nbsp;#{if d => 'Any' else ''}</small></div>"
  ).join("") + "</div>"
  postMessage {trs, ths}
