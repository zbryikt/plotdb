revert = (dataset) ->
  collen = dataset.[]fields.length
  rowlen = (dataset.[]fields.0 or {}).[]data.length or 0
  ret = [dataset.fields.map(->it.name).join(",")]
  for i from 0 til rowlen
    ret.push (for j from 0 til collen =>
      v = "#{dataset.fields[j].data[i]}"
      if v.indexOf \, => v = "\"#v\""
      v
    ).join(",")
  postMessage {type: "parse.revert", data: ret.join(\\n)}

onmessage = ({data: payload}) ->
  if typeof(payload) != \object => return
  switch payload.type
  | "parse.revert" => revert payload.data
