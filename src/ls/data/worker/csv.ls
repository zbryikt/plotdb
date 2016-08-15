importScripts(
  \/assets/papaparse/4.1.2/papaparse.min.js
  \/assets/utf8js/2.0.0/utf8.js
  \/js/plotdb/type.js
  \/js/data/worker/grid-render.js
)

onmessage = (e) ->
  result = []
  Papa.parse (e.data.buf.trim! or ""), do
    worker: false#, header: true
    step: ({data: rows}) ~>
      len = result.length
      for i from 0 til rows.length => result[i + len] = rows[i]
      #result.length = len + rows.length
      #for row in rows => for k,v of row => result[][k].push v
    complete: ~>
      data = {}
      data.headers = result.0 or []
      result.splice 0,1
      data.rows = result
      data.types = plotdb.Types.resolve do
        rows: data.rows, headers: data.headers
      ret = grid-render {data}
      data <<< ret{trs, ths}
      #values = [v for k,v of result] or []
      #data.headers = [k for k of result]
      #len = result[][data.headers.0].length
      #data.rows = [{} for i from 0 til len]
      #data.rows.map (row,i) ~> data.headers.map ~> row[it] = result[it][i]
      postMessage {data}
