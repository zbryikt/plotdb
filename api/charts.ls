require! <[../engine/aux ../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

charttype = model.type.chart

engine.router.api.get "/chart/", (req, res) ->
  if !req.user => return res.send "[]"
  io.query [
    'select users.displayname as "ownerName",charts.*'
    "from charts,users where users.key = charts.owner and charts.owner = #{req.user.key}"
  ].join(" ")
    .then -> res.send it.rows
    .catch ->
      console.log e
      res.send "[]"

engine.router.api.get "/chart/:id", (req, res) ->
  io.query [
    'select users.displayname as "ownerName", charts.*'
    'from users,charts where users.key = owner and'
    "charts.key=#{req.params.id} limit 1"
  ].join(" ")
    .then (it={}) ->
      chart = it.[]rows.0
      if !chart => return aux.r404 res
      if (chart.{}permission.[]switch.indexOf(\public) < 0)
      and (!req.user or chart.owner != req.user.key) => return aux.r403 res, "forbidden"
      return res.json chart
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.router.api.post "/chart/", (req, res) ->
  if !req.user => return aux.r403 res
  data = req.body <<< {owner: req.user.key}
  dimlen = [k for k of (data.dimension or [])].length
  ret = charttype.lint data
  if ret.0 => return aux.r400 res, ret
  data = charttype.clean data
  params = [
    data.name or "untitled", req.user.key,
    data.theme or null, data.parent or null,
    data.description or "check it out by yourself!"
    data.basetype or [], data.visualencoding, data.category,
    data.tags, 0, data.searchable, dimlen
    new Date!toUTCString!, new Date!toUTCString!,
  ] ++ [
    data.doc, data.style, data.code, data.assets, data.permission
  ].map(->JSON.stringify(it))

  io.query([
    'insert into charts',
    ('(' + <[
      name owner theme parent description
      basetype visualencoding category
      tags likes searchable dimlen
      createdtime modifiedtime
      doc style code assets permission
    ]>.join(",") + ')'),
    'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)',
    'returning key'
  ].join(" "), params)
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      res.send data
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/chart/:id", (req, res) ~>
  if !req.user => aux.r403 res
  data = req.body
  if !data.key == req.params.id => return aux.r400 res, [true, data.key, \key-mismatch]

  io.query "select * from charts where key = #{req.params.id} limit 1"
    .then (r = {}) ->
      chart = r.rows.0
      if !chart => return aux.r404 res
      if chart.owner != req.user.key => return aux.r403 res
      data <<< do
        owner: req.user.key
        key: req.params.id
        modifiedtime: new Date!toUTCString!
      ret = charttype.lint(data)
      if ret.0 => return aux.r400 res, ret
      data := charttype.clean data

      io.query([
        'update charts set'
        ( '(' + <[
          name owner theme parent description
          basetype visualencoding category
          tags likes searchable
          createdtime modifiedtime
          doc style code assets permission
        ]>.join(",") + ')'),
        '= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
        "where key = #{req.params.id}"
      ].join(" "),[
        data.name or "untitled", req.user.key,
        data.chart or null, data.parent or null,
        data.description or "check it out by yourself!"
        data.basetype, data.visualencoding, data.category,
        data.tags, 0, data.searchable, new Date!toUTCString!, new Date!toUTCString!,
        data.doc, data.style, data.code, data.assets, data.permission
      ])
        .then (r={}) -> res.send data
        .catch ->
          console.error it.stack
          aux.r403 res
    .catch ->
      console.error it.stack
      return aux.r403 res
