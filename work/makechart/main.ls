require! <[fs fs-extra bluebird fs-extra]>
require! <[../../engine/aux ../../engine/share/model/ ../../engine/io/postgresql/]>
require! <[../../secret ./base64 ./utf8]>
config = require "../../engine/config/#{secret.config}"

config = aux.merge-config config, secret
bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

params = [2097,{}]
io = new postgresql config

io.query "select doc from charts where key = 2203" .then (r={}) ->
  doc = r.rows.0.doc

  counties = <[
    彰化縣 屏東縣 雲林縣 新竹市 新北市 花蓮縣 連江縣 基隆市 臺東縣 臺北市
    南投縣 宜蘭縣 臺中市 嘉義縣 新竹縣 臺南市 嘉義市 苗栗縣 桃園市
  ]>
  count = 2201
  promises = []

  doit = (county, count) ->
    object = {"assets":[{"name":"#county.json","type":"application/json","content":""}]}
    object.assets[0].content = base64.encode(utf8.encode(
      fs.read-file-sync "/Users/tkirby/workspace/data/taiwan/topojson/village/final/#county.json" .toString!
    ))
    ret = io.query("update charts set assets = $1 where key = #count", [JSON.stringify(object.assets)])
      .then (r={}) ->
        payload = JSON.parse(JSON.stringify(doc))
        payload.content = payload.content.replace(/屏東縣/, "#county")
        desc = """動畫式的#{county}村里級熱圖，透過點擊縣市中的鄉鎮再顯示村里細節。資料以村里為主，但可選擇鄉鎮區塊的資料計算方式要透過村里數值的加總或平均，亦可自由控制是否要顯示鄉鎮區塊。"""
        io.query(
          "update charts set (doc,name,owner,description) = ($1,$2,$3,$4) where key = #count",
          [JSON.stringify(payload),"#{county}互動地圖", 4,desc]
        )
    return ret

  for county in counties =>
    count++
    promises.push doit county, count
  bluebird.all promises .then ->
    console.log "done."
    setTimeout (-> process.exit! ), 100
