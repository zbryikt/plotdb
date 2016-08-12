data-to-raw = (e) ->
  data = e.data
  h = data.headers
  list = []
  lastidx = 0
  for i from 0 til data.rows.length =>
    row = data.rows[i]
    if row.join('') => lastidx = i
    list.push h.map((d,i)->
      it = row[i]
      if !it => return it
      it = it.replace(/"/g,'""')
      if /[ ,\n\t]/.exec(it) => it = "\"#it\""
      return it
    ).join(\,)
  list.splice lastidx + 1
  ret = [
    data.headers.join(\,)
    list.join(\\n)
  ].join(\\n)
  return ret
