require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

control := control engine, io
foldertype = model.type.folder

get-charts = (req, ids) ->
  charts = null
  io.query([
    # Get charts from ids, along with their parents
    "with base as ("
    "    select * from charts where key = any($1::int[])"
    ") select charts.* from charts,base where charts.key = base.parent or charts.key = base.key"
  ].join(" "), [ids])
    .then (ret={}) ->
      charts := ret.[]rows
        .filter -> perm.test(req, it.permission, it.owner, \read)
        .map ->
          if !perm.test(req, it.{}permission, it.owner, \admin) => delete it.permission
          it
      hash = {}
      for chart in charts => hash[chart.key] = chart
      target = charts.filter -> it.key in ids
      target
        .filter -> it.inherit and it.inherit.length and it.parent
        .map (chart) ->
          parent = hash[chart.parent]
          if parent => chart.inhert.map -> chart[it] = parent[it]
      return {charts: target}


get-folder = (req, id) ->
  io.query "select name,permission,owner,key from folders where key = $1", [id]
    .then (r = {}) ->
      folder = r.[]rows.0
      if !folder => return aux.reject 404
      permission = folder.{}permission
      if permission.switch != \publish and !perm.test(req, permission, folder.owner, \read) => return aux.reject 403
      if !perm.test(req, permission, folder.owner, \admin) => delete folder.permission
      {folder, permission: permission}

engine.app.get \/collection/:id/download, aux.numid true, (req, res) ->
  folder = null
  get-folder req, req.params.id
    .then (ret) ->
      folder := ret.folder
      if !folder => return aux.reject 404
      io.query "select item as key from foldercontent where type = 'chart' and folder = $1", [folder.key]
    .then (r={}) ->
      get-charts req, r.[]rows.map(-> it.key)
    .then ({charts}) ->
      ret = """if(typeof(plotdb)=="undefined" && !plotdb) var plotdb = {};\n"""
      for chart in charts => 
        code = chart.code.content
        delete chart.code
        str = JSON.stringify(chart)
        str = str.substring(0, str.length - 1)
        str += ",code: {content: " + (if code.0=='{' => code else "{init: function() { #code }}")  + "}}";
        ret += "plotdb.chart.add(#{chart.key},#{str});\n"
      res.header(
        "Content-Disposition",
        """attachment; filename='#{escape(folder.name.replace(/ /g, '-'))}.js';modification-date="#{new Date()}" """
      )
      res.send ret
    .catch aux.error-handler res, true
    
engine.app.get \/collection/:id, aux.numid true, (req, res) ->
  get-folder req, req.params.id
    .then ({folder,permission}) ->
      permtype = perm.caltype req, permission, folder.owner
      res.render 'view/collection/index.jade', {folder,permtype}, (err, html) ->
        res.send html
      return null
    .catch aux.error-handler res, true

engine.router.api.get \/folder/, (req, res) ->
  if !req.user => return aux r404 res
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  owner = +req.query.owner or null
  keyword = (req.query.keyword or "").split(/[, ]/).map(->it.trim!).filter(->it)
  io.query(
    [
      "select folders.*,users.displayname as ownername from folders,users"
      "where"
      [
        "folders.owner = $3" if owner
        "folders.owner = users.key"
      ].filter(->it).join(" and ")
      "order by createdtime desc"
      "limit $1 offset $2"
    ].filter(->it).join(" "), [limit, offset, owner].filter(->it?)
  )
    .then (r={})->
      r.[]rows.map -> it.type = \folder
      folders = r.rows.filter (folder) ->
        if folder.permission.switch != \publish and !perm.test(req, folder.{}permission, folder.owner, \read) =>
          return false
        if !perm.test(req, folder.{}permission, folder.owner, \admin) => delete folder.permission
        return true
      res.send folders
    .catch aux.error-handler res

engine.router.api.get \/folder/:id, aux.numid false, (req, res) ->
  folder = null
  io.query("select * from folders where key = $1", [req.params.id])
    .then (r={})->
      folder := r.[]rows.0
      if !folder => return aux.reject 404
      permission = folder.permission
      if !perm.test(req, permission, folder.owner, \admin) => delete folder.permission
      if permission.switch != \publish and !perm.test(req, permission, folder.owner, \read) => return aux.reject 403
      io.query [
        "select charts.name,charts.description,charts.owner,users.displayname as ownername,"
        "foldercontent.item,foldercontent.type"
        "from foldercontent,charts,users"
        "where folder = $1 and charts.key=foldercontent.item and charts.owner=users.key"
      ].join(" "), [folder.key]
    .then (r={}) ->
      folder.content = r.[]rows
      res.send folder
    .catch aux.error-handler res

engine.router.api.post \/folder, (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  ret = foldertype.lint data
  if ret.0 => return aux.reject 400, ret
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
    .then ({folder,permission}) -> 
      if !folder => return aux.reject 404
      io.query "delete from foldercontent where folder = $1", [req.params.id]
    .then -> io.query("delete from folders where key = $1", [req.params.id])
    .then -> res.send []
    .catch aux.error-handler res

engine.router.api.post \/folder/:id/content/del, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  if !req.body or !req.body.item or !req.body.type => return aux.r403 res
  get-folder req, req.params.id
    .then ({folder,permission}) ->
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
    .then ({folder,permission}) ->
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
    .then ->
      io.query "update folders set thumbnail = $1 where key = $2", [req.body.item, req.params.id]
    .then -> res.send!
    .catch aux.error-handler res
