importScripts('/assets/js-xls/0.7.5/xlsx.full.min.js');
onmessage = (e) ->
  data = {}
  buf = e.{}data.buf
  workbook = XLSX.read buf, {type: \binary} # bottleneck 3.8
  sheet = workbook.Sheets[workbook.SheetNames[0]]
  list = XLSX.utils.sheet_to_json(sheet) # 0.3
  data.headers = h = [k for k of (list[0] or {})]
  data.rows = list.map (row) -> [row[k] for k in h]
  #list.map (row) -> for k of h => if !(row[k]?) => row[k] = "" # 0.6
  postMessage({data})

