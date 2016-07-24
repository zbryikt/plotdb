require! <[fs bluebird fs-extra]>
require! <[../engine/aux ../engine/share/model/ ../engine/io/postgresql/]>
require! <[../secret]>
config = require "../engine/config/#{secret.config}"

config = aux.merge-config config, secret
is-all = process.argv.indexOf(\all)>=0
name-index = process.argv.indexOf(\name)
if name-index >= 0 => name = process.argv[name-index + 1]
if !name => name = \chart-dump.json
is-force = process.argv.indexOf(\force)>=0

bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

io = new postgresql config

console.log "query all charts.."
io.query "select * from charts" + (if is-all => "" else " where owner=4")
  .then (r) ->
    console.log "dumping charts..."
    r.rows.forEach ->
      fs-extra.copy "../static/s/chart/#{it.key}.png", "thumbnail/#{it.key}.png"
    ret = r.rows.map -> it <<< {theme: null}
    packjson = JSON.parse(fs.read-file-sync name .toString!)
    if is-force =>
      mismatched = packjson.map(->it.key)
    else
      mismatched = []
      for item in packjson =>
        obj = ret.filter(->it.key == item.key).0
        if JSON.stringify(item) != JSON.stringify(obj) => mismatched.push item.key
    fs.write-file-sync name, JSON.stringify(ret)
    fs.write-file-sync "chart-to-update.json", JSON.stringify(mismatched)
    console.log "done."
    setTimeout (-> process.exit! ), 1000

