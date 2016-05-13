require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ../engine/io/postgresql/]>
require! <[../secret ../engine/share/config]>

config = aux.merge-config config, secret

bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

io = new postgresql config

console.log "query all charts.."
io.query "select * from charts where owner=4"
  .then (r) ->
    console.log "dumping charts..."
    fs.write-file-sync \chart-dump.json, JSON.stringify(r.rows)
    console.log "done."

