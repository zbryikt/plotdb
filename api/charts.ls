require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

control := control engine, io
charttype = model.type.chart

# for cross domain loading chart. disabled for now
# shall lookup if source domain is registered by subscribed users
if true =>
  engine.router.api.all \*, (req, res, next) ->
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next!

get-chart = (req, id, permcheck = true) ->
  chart = null
  io.query([
    'select users.displayname as ownername, charts.*'
    'from users,charts where users.key = owner and'
    "charts.key=$1"
  ].join(" "), [id])
    .then (it={}) ->
      chart := it.[]rows.0
      if !chart => return aux.reject 404
      if chart.inherit and chart.inherit.length and chart.parent =>
        io.query(
          'select charts.doc, charts.style, charts.code, charts.assets from charts where key = $1',
          [chart.parent]
        )
      else return bluebird.resolve {}
    .then (it={}) ->
      parent = it.[]rows.0
      if !parent => return {}
      chart.doc = parent.doc if 'document' in chart.inherit
      chart.style = parent.style if 'stylesheet' in chart.inherit
      chart.assets = parent.assets if 'assets' in chart.inherit
      chart.code = parent.code if 'code' in chart.inherit
    .then ->
      permission = chart.permission
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => delete chart.permission
      if permcheck => if !perm.test(req, permission, chart.owner, \read) => return aux.reject 403
      return {chart, permission}

engine.router.api.get "/chart/", (req, res) ->
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  keyword = (req.query.keyword or "").split(/[, ]/).map(->it.trim!).filter(->it)
  simple = !!req.query.simple
  if simple =>
    return io.query(
      [
        "select key, name from charts"
        "where owner = $1 and (name ~ ANY($2) or key::text ~ ANY($2))"
        "order by createdtime desc" if req.{}user.key
        "limit $3 offset $4"
      ].join(" "),
      [(req.{}user.key or 0), keyword, limit, offset]
    )
      .then (r={}) -> res.send(r.[]rows or [])
      .catch aux.error-handler res
  fav = req.query.fav and req.user
  overlap = do
    basetype: (req.query.type or "").split(\,).filter(->it)
    visualencoding: (req.query.enc or "").split(\,).filter(->it)
    category: (req.query.cat or "").split(\,).filter(->it)
    #tags: keyword
  equal = do
    dimlen: req.query.dim
    owner: req.query.owner or 4
  if !equal.owner or !req.user or (equal.owner and parseInt(equal.owner) != req.user.key) =>
    equal.searchable = true
  overlap = [[k,v] for k,v of overlap].filter(->it.1 and it.1.length)
  equal = [[k,v] for k,v of equal].filter(->it.1)
  conditions = (
    overlap.map((d,i) -> ["charts.#{d.0} && ",d.1]) ++
    equal.map((d,i) -> ["charts.#{d.0} = ",d.1])
  ).map((d,i) -> ["#{d.0} $#{i + 1}", d.1])
  paging = [[1,2].map(-> "$#{it + conditions.length}"), [offset, limit]]
  tagidx = conditions.length + 3
  charts = []

  #TODO check if we need to optimize this
  io.query([
    "select users.displayname as ownername,"
    "charts.key, charts.name, charts.description, charts.basetype, charts.visualencoding, charts.category,"
    " charts.tags, charts.likes, charts.permission->'switch' as published, charts.dimlen, charts.createdtime, charts.modifiedtime"
    "from charts,users" + (if fav => ",likes" else "")
    "where users.key = charts.owner and"
    (conditions.map(->it.0) ++ [
      "(charts.tags && $#tagidx or lower(charts.name) ~ ANY($#tagidx) or lower(charts.description) ~ ANY($#tagidx))" if keyword.length
    ]).filter(->it).join(" and ")
    (if fav => "and likes.type='chart' and likes.uid=charts.key and likes.owner=$#{tagidx + (if keyword.length => 1 else 0)}" else "")

    "order by createdtime desc" if req.query.owner
    "offset #{paging.0.0} limit #{paging.0.1}"
  ].join(" "), (
    conditions.map(->it.1) ++
    paging.1 ++
    (if keyword.length => [keyword.map(->it.toLowerCase!)] else []) ++
    (if fav and req.user => [req.user.key] else [])
  ))
    .then ->
      charts := it.rows
      if !charts.length or !req.user => return {rows: []}
      io.query(
        (
          "select uid from likes where owner=$1 and type='chart'" +
          " and uid in (#{charts.map(->it.key).join(\,)})"
        ),
        [req.user.key]
      )
    .then (r = {})->
      hash = {}
      for item in r.rows => hash[item.uid] = 1
      for item in charts => if hash[item.key] => item.liked = true
      res.send charts
    .catch (e) -> res.send [] # note: input might have RE. syntax error will have exception.

engine.router.api.get "/chart/:id", aux.numid false, (req, res) ->
  get-chart req, req.params.id
    .then ({chart, permission}) -> return res.json chart
    .catch aux.error-handler res

engine.router.api.post "/chart/", (req, res) ->
  data = []
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  if control.size-limit req.user => return aux.r402 res, 'exceed size limit'
  team = +req.query.team
  promise = if team =>
    io.query "select teams.key, teams.avatar, teams.name from teams where key = $1", [team]
  else bluebird.resolve!
  promise
    .then (r={}) ->
      team := r.[]rows.0
      io.query "select count(key) as count from charts where owner = $1", [req.user.key]
    .then (r={}) ->
      # personal item count control
      plan = req.user.{}payment.plan or 0
      count = ((r.[]rows.0 or {}).count or 0)
      if count >= 3000 => return aux.reject 402, 'exceed count limit' #hard limit
      data := req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
      if !team or !team.key or !typeof(team.key) == \number => team := null
      if !(engine.config.mode % 2) =>
        if (plan == 0 and count >= 30) or (plan == 1 and count >= 300) =>
          return aux.reject 402, 'exceed count limit'
        if plan < 1 => data.{}permission.list = [{"perm": "fork", "type": "global", "target": null}]
      if team => data.{}permission.list = [{
        "perm": "write", "type": "team", "target": team.key, avatar: team.avatar, displayname: team.name
      }]
      ret = charttype.lint data
      if ret.0 => return aux.reject 400, ret
      data := charttype.clean data
      pairs = io.aux.insert.format charttype, data
      delete pairs.key
      pairs = io.aux.insert.assemble pairs
      thumb.save 'chart', data
      io.query "insert into charts #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      control.get-size [[\charts, \key, key]]
    .then (size) ->
      control.update-size req, req.user, size
      if team =>
        io.query "select permission,owner from teams where key = $1", [team.key]
          .then (r={}) ->
            r = r.[]rows.0 or {}
            permission = r.permission or {}
            owner = r.owner or 0
            if !perm.test(req, permission, owner, \write) =>
              return aux.reject 403, 'chart created but failed to add into team'
          .then ->
            io.query(
              "insert into teamcharts (team,chart) values ($1,$2) on conflict do nothing"
              [team.key,data.key]
            )
      else bluebird.resolve!
    .then -> res.send data
    .catch aux.error-handler res

engine.router.api.put "/chart/:id", aux.numid false, (req, res) ~>
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  id = parseInt(req.params.id)
  data = req.body
  chart = null
  oldsize = 0
  if data.key != id => return aux.r400 res, [true, data.key, \key-mismatch]
  io.query "select * from charts where key = $1", [id]
    .then (r = {}) ->
      chart := r.rows.0
      if !chart => return aux.reject 404
      if chart.parent => return io.query("select key from charts where key = $1", [chart.parent])
      else return {rows: []}
    .then (r = {}) ->
      if !r.rows or !r.rows.length => chart.parent = null
      if !chart.parent => delete data.parent
      if !perm.test(req, chart.{}permission, chart.owner, \write) => return aux.reject 403
      return control.get-size [[\charts, \key, data.key]]
    .then (size) ->
      oldsize := size
      data <<< do
        owner: chart.owner
        key: id
        modifiedtime: new Date!toUTCString!
      if !( engine.config.mode % 2 ) =>
        plan = req.user.{}payment.plan or 0
        if plan < 1 => data.{}permission.list = chart.permission.list
      ret = charttype.lint(data)
      if ret.0 => return aux.reject 400, ret
      data := charttype.clean data
      for name,value of data.dimension =>
        value.type = value.type.map ->
          if !it => "String" else if typeof(it) == typeof({}) => it.name else it
      pairs = io.aux.insert.format charttype, data
      <[key createdtime]>.map -> delete pairs[it]
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => delete pairs.permission
      pairs = io.aux.insert.assemble pairs
      thumb.save 'chart', data
      io.query(
        "update charts set #{pairs.0} = #{pairs.1} where key = $#{pairs.2.length + 1}",
        pairs.2 ++ [id]
      )
    .then -> control.get-size [[\charts, \key, data.key]]
    .then (size) -> control.update-size req, data.owner, size - oldsize
    .then -> res.send data
    .catch aux.error-handler res

engine.router.api.delete "/chart/:id", aux.numid false, (req, res) ~>
  chart = null
  if !req.user => return aux.r403 res
  io.query "update charts set parent = null where parent = $1", [req.params.id]
    .then -> io.query "select * from charts where key = $1", [req.params.id]
    .then (r = {}) ->
      chart := r.[]rows.0
      if !chart => return aux.reject 404
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => return aux.reject 403
      return control.get-size [[\charts, \key, chart.key]]
    .then (size) -> control.update-size(req, chart.owner, -size),
    .then -> io.query("delete from charts where key = $1", [req.params.id])
    .then -> res.send []
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.app.get \/chart/, (req, res) ->
  return res.render 'view/chart/index.jade', {chart: {}}

engine.app.get \/chart/:id, aux.numid true, (req, res) ->
  get-chart req, req.params.id
    .then ({chart,permission}) ->
      permtype = perm.caltype req, permission, chart.owner
      res.render 'view/chart/index.jade', {chart,permtype}, (err, html) ->
        # size
        # console.log html.length
        res.send html
      return null
    .catch aux.error-handler res, true

engine.router.api.put \/chart/:id/like, aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  liked = false
  chart = {}
  bluebird.all([
    io.query "select * from likes where owner = $1 and type='chart' and uid=$2", [req.user.key,req.params.id]
      .then (r = {}) -> liked := r.rows.length
    io.query "select likes,key,permission from charts where key = $1", [req.params.id]
      .then (r = {}) -> chart := r.[]rows.0
  ]).then ->
    .then (r = {}) ->
      if !chart => return aux.r404 res
      if !perm.test(req, chart.{}permission, chart.owner, \read) => return aux.r403 res
      v = !!!liked
      req.user.{}likes.{}chart[chart.key] = v
      chart.likes = (chart.likes or 0) + (if v => 1 else -1) >? 0
      bluebird.all([
        (if !v => io.query "delete from likes where owner=$1 and type='chart' and uid=$2", [req.user.key, chart.key]
        else io.query "insert into likes (owner,type,uid) values ($1,'chart',$2)", [req.user.key, chart.key])
        io.query "update charts set likes = $1 where key = $2", [chart.likes, chart.key]
      ])
    .then ->
      req.login req.user, -> res.send!
      return null
    .catch ->
      console.error it.stack
      aux.r403 res


engine.app.get \/v/chart/:id/, aux.numid true, (req, res) ->
  [chart,theme,permission] = [null,null,null]
  get-chart req, req.params.id, false
    .then ({chart: c, permission: p}) ->
      chart := c
      permission := p
      io.query "select users.payment from users where users.key = $1", [chart.owner]
    .then (r = {})->
      payment = (r.[]rows.0 or {payment: {}}).payment or {}
      token = req.query.token or null
      if !chart => return aux.reject 404
      if (permission.switch != \publish)
      and (!req.user or chart.owner != req.user.key)
      and (!token or permission.list.filter(->
        it.type==\token and it.target == token and perm.type.indexOf(it.perm) >= perm.type.indexOf(\read)
      ).length == 0) =>
        return aux.reject 403
      chart.plan = payment.plan or 0
      if !chart.theme => return bluebird.resolve!
      io.query "select * from themes where key = chart.theme"
    .then (r={}) ->
      r = r.[]rows.0
      if r =>
        theme := if (r.{}permission.switch != \publish)
        and (!req.user or r.owner != req.user.key) => null else r
        delete theme.permission
      fieldkeys = [v.[]fields.map(->it.key) for k,v of chart.dimension]
        .reduce(((a,b)->a++b),[])
        .filter(->it)
      if !fieldkeys.length => return bluebird.resolve!
      io.query([
        "select datafields.*,datasets.owner,datasets.permission"
        "from datafields,datasets"
        "where datafields.key in (#{fieldkeys.join(\,)})"
        "and datasets.key = datafields.dataset"
      ].join(" "))
    .then (r={}) ->
      fields = r.[]rows
      fields = fields.filter((f)->
        (f.{}permission.switch == 'publish') or (req.user and f.owner == req.user.key)
        or f.{}permission.list.filter(->
          it.type == \chart and perm.type.indexOf(it.perm) >= perm.type.indexOf(\read) and +it.target == +chart.key
        ).length
      )
      fields.map -> delete it.permission
      fields ++= [v.[]fields.filter(->!it.key) for k,v of chart.dimension].reduce(((a,b)->a++b),[])
      res.render 'view/chart/view.jade', {chart, theme, fields}, (err, html) ->
        # size
        # console.log html.length
        res.send html
      return null
    .catch (e) ->
      if e and e.code == 404 => res.status(404).render 'v/404.jade'
      else => res.status(403).render 'v/403.jade'
      return null
