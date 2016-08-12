onmessage = (e) ->
  dataset = e.data.dataset
  data = {}
  data.headers = dataset.fields.map(->it.name)
  data.rows = []
  collen = dataset.[]fields.length
  rowlen = (dataset.[]fields.0 or {}).[]data.length or 0
  ret = [dataset.fields.map(->it.name).join(",")]
  for i from 0 til rowlen
    data.rows.push [dataset.fields[j].data[i] for j from 0 til collen]
    ret.push (for j from 0 til collen =>
      v = "#{dataset.fields[j].data[i]}"
      if v.indexOf \, => v = "\"#v\""
      v
    ).join(",")
  raw = ret.join \\n
  postMessage {data, raw}
