require! <[fs path pg bluebird]>
require! <[../engine/share/model/ ../engine/io/postgresql ../secret]>
require! <[../engine/io/postgres/aux]>

charttype = model.type.chart

io = new postgresql secret

schema = "postgres://plotdb@localhost/plotdb"
client = new pg.Client schema
(e) <- client.connect

files = fs.readdir-sync '../.localfsdb/chart/' .map -> path.join '../.localfsdb/chart', it
ps = []
push = (file) ->
  chart = JSON.parse(fs.read-file-sync file .toString!)
  chart.description = chart.desc
  delete chart.desc
  delete chart.theme
  delete chart.parent
  chart.basetype = [chart.basetype]
  chart.modifiedtime = chart.modifiedTime
  chart.createdtime = chart.createdTime
  delete chart.modifiedTime
  delete chart.createdTime
  chart.searchable = true
  chart.owner = 4
  pairs = aux.insert.format charttype, chart
  delete pairs.key
  pairs = aux.insert.assemble pairs
  console.log pairs.0
  console.log pairs.2
  ps.push io.query "insert into charts #{pairs.0} values #{pairs.1} returning key", pairs.2

for file in files => push file

bluebird.all ps
  .then -> 
    console.log "finished. hit ctrl-c to end"
    client.end!
  .catch (a,b) -> console.log a,b

