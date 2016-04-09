require! <[../engine/aux ../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

themetype = model.type.theme

engine.router.api.get "/theme/", (req, res) ->
  #TODO consider general dataset api 
  if !req.user => return res.send []
  io.query [
    'select users.displayname as "ownerName",themes.*'
    "from themes,users where users.key = themes.owner and themes.owner = #{req.user.key}"
  ].join(" ")
    .then -> res.send it.rows
    .catch ->
      console.log e
      res.send []

engine.router.api.get "/theme/:id", (req, res) ->
  io.query [
    'select users.displayname as "ownerName", themes.*'
    'from users,themes where users.key = owner and'
    "themes.key=#{req.params.id}"
  ].join(" ")
    .then (it={}) ->
      theme = it.[]rows.0
      if !theme => return aux.r404 res
      if (theme.{}permission.[]switch.indexOf(\public) < 0)
      and (!req.user or theme.owner != req.user.key) => return aux.r403 res, "forbidden"
      return res.json theme
    .catch -> return aux.r403 res

engine.router.api.post "/theme/", (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  ret = themetype.lint data
  if ret.0 => return aux.r400 res, ret
  data = themetype.clean data
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
      res.send data
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/theme/:id", (req, res) ~>
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body
  if !data.key == req.params.id => return aux.r400 res, [true, data.key, \key-mismatch]

  io.query "select * from themes where key = #{req.params.id}"
    .then (r = {}) ->
      theme = r.rows.0
      if !theme => return aux.r404 res
      if theme.owner != req.user.key => return aux.r403 res
      data <<< do
        owner: req.user.key
        key: req.params.id
        modifiedtime: new Date!toUTCString!
      ret = themetype.lint(data)
      if ret.0 => return aux.r400 res, ret
      data := themetype.clean data

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
      ])
        .then (r={}) -> res.send data
        .catch ->
          console.error it.stack
          aux.r403 res

    .catch ->
      console.error it.stack
      return aux.r403 res

engine.router.api.delete "/theme/:id", (req, res) ~>
  if !req.user => return aux.r403 res
  io.query "select * from themes where key = $1", [req.params.id]
    .then (r = {}) ->
      theme = r.[]rows.0
      if !theme => return aux.r404 res
      if theme.owner != req.user.key => return aux.r403 res
      io.query "delete from themes where key = $1", [req.params.id]
        .then -> res.send []
    .catch ->
      console.error it.stack
      return aux.r403 res
