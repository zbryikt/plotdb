require! <[../engine/aux ../engine/share/model/ ./thumb ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

control := control engine, io

themetype = model.type.theme

engine.router.api.get "/theme/", (req, res) ->
  #TODO consider general dataset api 
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  if !req.user => return res.send []
  io.query(
    ["select users.displayname as ownername,themes.*"
     "from themes,users where users.key = themes.owner"
     "and (themes.searchable = true or themes.owner = $1)"
     " offset $2 limit $3"
    ].filter(->it).join(" "),
    [req.user.key, offset, limit]
  )
    .then -> res.send it.rows
    .catch ->
      console.log e
      res.send []

engine.router.api.get "/theme/:id", aux.numid false, (req, res) ->
  io.query(
    [
      'select users.displayname as ownername, themes.*'
      'from users,themes where users.key = owner and'
      'themes.key=$1'
    ].join(" "),[req.params.id]
  )
    .then (it={}) ->
      theme = it.[]rows.0
      if !theme => return aux.r404 res
      if !perm.test(req, chart.{}permission, chart.owner, \read) => return aux.r403 res, "forbidden"
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => delete chart.permission
      return res.json theme
    .catch -> return aux.r403 res

engine.router.api.post "/theme/", (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = null
  # personal item count control
  io.query "select count(key) as count from themes where owner = $1", [req.user.key]
    .then (r={}) ->
      plan = req.user.{}payment.plan or 0
      count = ((r.[]rows.0 or {}).count or 0)
      if (plan == 0 and count >= 30) or (plan == 1 and count >= 300) =>
        return aux.reject 402, 'exceed count limit'
      data := req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
      ret = themetype.lint data
      if ret.0 => return aux.r400 res, ret
      data := themetype.clean data
      thumb.save 'theme', data
      io.query([
        'insert into themes',
        ('(' + <[
          name owner chart parent description
          tags likes searchable createdtime modifiedtime
          doc style code assets permission
        ]>.join(",") + ')'),
        'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
        'returning key'
      ].join(" "),[
        data.name or "untitled", req.user.key,
        data.chart or null, data.parent or null,
        data.description or "check it out by yourself!", data.tags,
        0, data.searchable, new Date!toUTCString!, new Date!toUTCString!,
        data.doc, data.style, data.code, data.assets, data.permission
      ])
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      control.get-size [[\themes, \key, key]]
    .then (size) -> control.update-size req, req.user, size
    .then ->
      res.send data
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/theme/:id", aux.numid false, (req, res) ~>
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  id = parseInt(req.params.id)
  data = req.body
  if !data.key == req.params.id => return aux.r400 res, [true, data.key, \key-mismatch]
  oldsize = 0
  theme = null
  io.query "select * from themes where key = #{req.params.id}"
    .then (r = {}) ->
      theme := r.rows.0
      if !theme => return aux.reject 404
      if !perm.test(req, theme.{}permission, theme.owner, \write) => return aux.reject 403
      return control.get-size [[\themes, \key, data.key]]
    .then (size) ->
      oldsize := size
      data <<< do
        owner: req.user.key
        key: req.params.id
        modifiedtime: new Date!toUTCString!
      ret = themetype.lint(data)
      if ret.0 => return aux.reject 400, ret
      data := themetype.clean data

      pairs = io.aux.insert.format themetype, data
      <[key owner createdtime]>.map -> delete pairs[it]
      if !perm.test(req, theme.{}permission, theme.owner, \admin) => delete pairs.permission
      pairs = io.aux.insert.assemble pairs
      thumb.save 'theme', data
      /*
      io.query([
        'update themes set'
        ('(name,owner,chart,description,tags,likes,searchable,' +
        'createdtime,modifiedtime,doc,style,code,assets,permission)'),
        '= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
        "where key = #{req.params.id}"
      ].join(" "),[
        data.name or "untitled", req.user.key,
        data.chart or null,
        data.description or "check it out by yourself!", data.tags,
        0, data.searchable, new Date!toUTCString!, new Date!toUTCString!,
        data.doc, data.style, data.code, data.assets, data.permission
      ])*/

      io.query(
        "update themes set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}",
        pairs.2 ++ [id]
      )
    .then -> control.get-size [[\themes, \key, data.key]]
    .then (size) -> control.update-size req, data.owner, size - oldsize
    .then -> res.send data
    .catch aux.error-handler res

engine.router.api.delete "/theme/:id", aux.numid false, (req, res) ~>
  theme = null
  if !req.user => return aux.r403 res
  io.query "select * from themes where key = $1", [req.params.id]
    .then (r = {}) ->
      theme := r.[]rows.0
      if !theme => return aux.r404 res
      if !perm.test(req, theme.{}permission, theme.owner, \admin) => return aux.r403 res
      return control.get-size [[\themes, \key, theme.key]]
    .then (size) -> control.update-size(req, theme.owner, -size),
    .then -> io.query "delete from themes where key = $1", [req.params.id]
    .then -> res.send []
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.app.get \/theme/, (req, res) ->
  return res.render 'view/theme/index.jade'

engine.app.get \/theme/:id, aux.numid true, (req, res) ->
  io.query "select * from themes where key = $1", [req.params.id]
    .then (r = {}) ->
      theme = r.[]rows.0
      if !theme => return aux.r404 res, "", true
      if !perm.test(req, theme.{}permission, theme.owner, \read) => return aux.r403 res, "forbidden", true
      permtype = perm.caltype req, theme.{}permission, theme.owner
      if !perm.test(req, theme.{}permission, theme.owner, \admin) => delete theme.permission
      res.render 'view/theme/index.jade', {theme,permtype}
      return null
    .catch ->
      console.error it.stack
      return aux.r403 res, "no luck.", true
