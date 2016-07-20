require! <[fs bluebird fs-extra]>
require! <[../engine/aux ../engine/share/model/ ../engine/io/postgresql/]>
require! <[../secret]>
config = require "../engine/config/#{secret.config}"

config = aux.merge-config config, secret
is-all = process.argv.indexOf(\all)>=0
name = "chart-dump.json"
if /\.json/.exec(process.argv[* - 1]) => name = process.argv[* - 1]

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
    fs.write-file-sync name, JSON.stringify(ret)
    console.log "done."
    setTimeout (-> process.exit! ), 1000

