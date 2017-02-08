require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

control := control engine, io
foldertype = model.type.folder

get-folder = (req, id) ->
  io.query "select permission,owner,key from folders where key = $1", [id]
    .then (r = {}) ->
      folder = r.[]rows.0
      if !folder => return aux.reject 404
      if !perm.test(req, folder.{}permission, folder.owner, \admin) => return aux.reject 403
      folder

engine.router.api.get \/folder/, (req, res) ->
  if !req.user => return aux r404 res
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  keyword = (req.query.keyword or "").split(/[, ]/).map(->it.trim!).filter(->it)
  io.query(
    [
      "select * from folders"
      "where owner = $1"
      "order by createdtime desc"
      "limit $2 offset $3"
    ].join(" "), [req.user.key, limit, offset]
  )
    .then (r={})-> res.send r.rows
    .catch aux.error-handler res

engine.router.api.get \/folder/:id, aux.numid false, (req, res) ->
  folder = null
  io.query("select * from folders where key = $1", [req.params.id])
    .then (r={})->
      folder := r.[]rows.0
      if !folder => return aux.reject 404
      permission = folder.permission
      if !perm.test(req, folder.{}permission, folder.owner, \admin) => delete folder.permission
      if !perm.test(req, permission, folder.owner, \read) => return aux.reject 403
      io.query "select name,item,type from foldercontent where folder = $1", [folder.key]
    .then (r={}) ->
      folder.content = r.[]rows
      res.send folder
    .catch aux.error-handler res

engine.router.api.post \/folder, (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  ret = foldertype.lint data
  if ret.0 => reture aux.reject 400, ret
  data = foldertype.clean data
  pairs = io.aux.insert.format foldertype, data
  delete pairs.key
  pairs = io.aux.insert.assemble pairs
  io.query "insert into folders #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
    .then -> res.send data
    .catch aux.error-handler res

engine.router.api.put \/folder/:id, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  id = parseInt(req.params.id)
  data = req.body
  folder = null
  if data.key != id => return aux.r400 res, [true, data.key, \key-mismatch]
  io.query "select * from folders where key = $1", [id]
    .then (r = {}) ->
      folder := r.rows.0
      if !folder => return aux.reject 404
      if !perm.test(req, folder.{}permission, folder.owner, \write) => return aux.reject 403
      data <<< do
        owner: folder.owner
        key: id
        modifiedtime: new Date!toUTCString!
      ret = foldertype.lint(data)
      if ret.0 => return aux.reject 400, ret
      data := foldertype.clean data
      pairs = io.aux.insert.format foldertype, data
      <[key createdtime]>.map -> delete pairs[it]
      if !perm.test(req, folder.{}permission, folder.owner, \admin) => delete pairs.permission
      pairs = io.aux.insert.assemble pairs
      io.query(
        "update folders set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}",
        pairs.2 ++ [id]
      )
    .then -> res.send data
    .catch aux.error-handler res

engine.router.api.delete \/folder/:id, aux.numid false, (req, res) ->
  folder = null
  if !req.user => return aux.r403 res
  get-folder req, req.params.id
    .then (folder) -> bluebird.resolve! #TODO: update content
    .then -> io.query("delete from folders where key = $1", [req.params.id])
    .then -> res.send []
    .catch aux.error-handler res

engine.router.api.post \/folder/:id/content/del, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.item or !req.body.type => return aux.r403 res
  get-folder req, req.params.id
    .then (folder) ->
      io.query(
        "delete from foldercontent where folder = $1 and item = $2 and type = $3",
        [req.params.id, req.body.item, req.body.type]
      )
    .then -> res.send!
    .catch aux.error-handler res

engine.router.api.post \/folder/:id/content, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.item or !req.body.type => return aux.r403 res
  get-folder req, req.params.id
    .then (folder) ->
      io.query(
        "select folder,item,type from foldercontent where folder=$1 and item=$2 and type=$3",
        [req.params.id, req.body.item, req.body.type]
      )
    .then (r={}) ->
      if r.[]rows.length => return aux.reject 403, "existed"
      io.query(
        "insert into foldercontent (folder,item,type) values ($1,$2,$3)",
        [req.params.id, req.body.item, req.body.type]
      )
    .then -> res.send!
    .catch aux.error-handler res
