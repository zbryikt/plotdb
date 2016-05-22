require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ../engine/io/postgresql/]>
require! <[../secret]>
config = require "../engine/config/#{secret.config}"

charttype = model.type.chart
config = aux.merge-config config, secret

bluebird.config do
  warnings: true
  longStackTraces: true
  cancellation: true
  monitoring: true

io = new postgresql config

charts = JSON.parse(fs.read-file-sync \chart-dump.json .toString!)

console.log "update database..."
promises = for i from 0 til charts.length =>
  pairs = io.aux.insert.format charttype, charts[i]
  join = ([a,b,c]) -> 
    a = /\((.+)\)/.exec(a).1.split \,
    b = /\((.+)\)/.exec(b).1.split \,
    (for i from 0 til a.length => "#{a[i]}=#{b[i]}").join(",")
  pairs = io.aux.insert.assemble pairs
  updater = join(pairs)
  io.query("insert into charts #{pairs.0} values #{pairs.1} on conflict (key) do update set #updater", pairs.2)
bluebird.all promises .then -> console.log "done."
