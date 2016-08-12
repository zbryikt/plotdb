importScript \/js/plotdb/type.js

onmessage = (e) ->
  types = plotdb.Types.resolve {rows: e.data.rows, headers: e.data.headers}
  postMessage types
