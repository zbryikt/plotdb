importScripts(
  \/assets/js-xls/0.7.5/xlsx.full.min.js
  \/js/plotdb/type.js
  \/js/data/worker/grid-render.js
)
onmessage = (e) ->
  data = {}
  buf = e.{}data.buf
  workbook = XLSX.read buf, {type: \binary} # bottleneck 3.8
  sheet = workbook.Sheets[workbook.SheetNames[0]]
  list = XLSX.utils.sheet_to_json(sheet) # 0.3
  data.headers = h = [k for k of (list[0] or {})]
  data.rows = list.map (row) -> [row[k] for k in h]
  data.types = plotdb.Types.resolve do
    rows: data.rows, headers: data.headers
  ret = grid-render {data}
  data <<< ret{trs, ths}
  postMessage {data}
