require! <[bluebird crypto fs fs-extra lwip read-chunk image-type]>
require! <[../secret ../engine/aux ../engine/io/postgresql/]>
require! <[../engine/share/model/]>
config = require "../engine/config/#{secret.config}"

config = aux.merge-config config, secret
io = new postgresql config
usertype = model.type.user
dstype = model.type.dataset
dftype = model.type.datafield

files = fs.readdir-sync \twstat/csv/county/index/ .map ->
  {name: it.replace(/\.csv$/,""), path: "twstat/csv/county/index/#it"}

loadfile = (file,owner) -> new bluebird (res, rej) ->
  data = fs.read-file-sync file.path .toString!
  lines = data.split \\n .map -> it.split \,
  fields  = lines.0.map -> {name: it, datatype: null}
  dataset = do
    owner: owner
    parent: null
    name: file.name
    description: file.name
    tags: []
    likes: 0
    searchable: true
    createdtime: new Date!
    modifiedtime: new Date!
    rows: lines.length 
    size: data.length
    type: \static
    format: \csv
    config: {}
    permission: {"value": [], "switch": [\public]}
    fields: fields

  pairs = io.aux.insert.format dstype, dataset
  pairs = io.aux.insert.assemble pairs
  console.log "insert dataset: #{file.name}"
  io.query "insert into datasets #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      datafields = lines.0.map (d,i) ->
        ret = do
          dataset: key
          datasetname: dataset.name
          location: \server
          name: d
          datatype: null
          data: lines.map((d)-> d[i]).filter((d,i)-> i>0)
      console.log "insert #{datafields.length} datafields for dataset #{file.name}"
      promises = datafields.map (df) ->
        pairs = io.aux.insert.format dftype, df
        pairs = io.aux.insert.assemble pairs
        io.query "insert into datafields #{pairs.0} values #{pairs.1}", pairs.2
      bluebird.all promises
        

user = do
  username: "twstat.data@plotdb.com"
  password: ""
  usepasswd: false
  displayname: "Taiwan Stat"
  createdtime: new Date!
  avatar: 0

keys = []
owner = 0
console.log "find taiwan stat owner..."
io.query "select * from users where username=$1", [user.username]
  .then (r={}) ->
    if !r.rows.0 =>
      pairs = io.aux.insert.format usertype, user
      pairs = io.aux.insert.assemble pairs
      console.log "not found. insert one..."
      io.query "insert into users #{pairs.0} values #{pairs.1} returning key", pairs.2
    else bluebird.resolve({rows:[{key: r.rows.0.key}]})
  .then (r={}) ->
    owner := r.[]rows.0.key
    console.log "taiwan stat owner key = #owner, listing all datasets from it..."
    io.query("select key from datasets where datasets.owner=$1",[owner])
  .then (r={}) ->
    keys := r.[]rows.map -> it.key
    console.log "total #{keys.length} dataset. drop all datafields from them..."
    if keys.length =>
      return io.query( "delete from datafields where dataset in (#{keys.join(\,)})" )
    else return bluebird.resolve!
  .then ->
    console.log "drop all dataset from taiwan stat..."
    io.query("delete from datasets where owner=$1", [owner])
  .then ->
    console.log "load #{files.length} dataset..."
    promises = files.map -> loadfile it, owner
    bluebird.all promises
  .then ->
    console.log "finished."
