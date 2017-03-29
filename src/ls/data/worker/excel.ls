importScripts(
  \/assets/js-xls/0.7.5/xlsx.full.min.js
  \/js/plotdb/type.js
  \/js/data/worker/grid-render.js
)
onmessage = (e) ->
  if e.data.type == \get-sheet-list =>
    workbook = XLSX.read e.data.buf, {type: \binary} # bottleneck 3.8
    postMessage {type: \sheet-list, data: workbook.SheetNames}
  if e.data.type == \get-sheet =>
    data = {}
    workbook = XLSX.read e.data.buf, {type: \binary} # bottleneck 3.8
    sheet = workbook.Sheets[e.data.sheet-name or workbook.SheetNames[0]]
    list = XLSX.utils.sheet_to_json(sheet) # 0.3
    data.headers = h = [k for k of (list[0] or {})]
    data.rows = list.map (row) -> [row[k] for k in h]
    data.types = plotdb.Types.resolve do
      rows: data.rows, headers: data.headers
    ret = grid-render {data}
    data <<< ret{trs, ths}
    postMessage {type: \sheet, data}
