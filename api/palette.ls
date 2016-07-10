require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb]>
(engine,io) <- (->module.exports = it)  _

paltype = model.type.palette

engine.router.api.get "/palette/", (req, res) ->
  if !req.user => res.send []
  keyword = (req.query.keyword or "").split(/[, ]/).map(->it.trim!).filter(->it)
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  io.query( "select * from palettes where owner=$1 offset $2 limit $3", [req.user.key, offset, limit])
    .then ->
      res.send it.rows or []
    .catch (e) ->
      console.log e.stack
      res.send []

engine.router.api.post "/palette/", (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  ret = paltype.lint data
  if ret.0 => return aux.r400 res, ret
  data = paltype.clean data
  pairs = io.aux.insert.format paltype, data
  delete pairs.key
  pairs = io.aux.insert.assemble pairs
  io.query "insert into palettes #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      res.send data
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/palette/:id", aux.numid false, (req, res) ~>
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  id = parseInt(req.params.id)
  if req.body.key != id => return aux.r400 res, [true, req.body.key, \key-mismatch]
  data = req.body
  io.query "select * from palettes where key = $1", [id]
    .then (r = {}) ->
      palette = r.[]rows.0
      if !palette => return aux.r404 res
      if palette.owner != req.user.key => return aux.r403 res
      data <<< do
        owner: req.user.key
        key: id
        modifiedtime: new Date!toUTCString!
      ret = paltype.lint(data)
      if ret.0 => return aux.r400 res, ret
      data := paltype.clean data
      pairs = io.aux.insert.format paltype, data
      <[key createdtime]>.map -> delete pairs[it]
      pairs = io.aux.insert.assemble pairs
      io.query(
        "update palettes set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}",
        pairs.2 ++ [id]
      )
    .then -> res.send data
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.router.api.delete "/palette/:id", aux.numid false, (req, res) ~>
  if !req.user => return aux.r403 res
  io.query "select * from palettes where key = $1", [req.params.id]
    .then (r = {}) ->
      palette = r.[]rows.0
      if !palette => return aux.r404 res
      if palette.owner != req.user.key => return aux.r403 res
      io.query "delete from palettes where key = $1", [req.params.id]
    .then -> res.send []
    .catch ->
      console.error it.stack
      return aux.r403 res
