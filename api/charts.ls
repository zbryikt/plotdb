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

engine.router.api.get "/chart/", (req, res) ->
  offset = req.query.offset or 0
  limit = (req.query.limit or 20) <? 100
  keyword = (req.query.keyword or "").split(/[, ]/).map(->it.trim!).filter(->it)
  simple = !!req.query.simple
  if simple =>
    return io.query(
      "select key, name from charts where owner = $1 and (name ~ ANY($2) or key::text ~ ANY($2)) limit $3 offset $4",
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
    " charts.tags, charts.likes, charts.searchable, charts.dimlen, charts.createdtime, charts.modifiedtime"
    "from charts,users" + (if fav => ",likes" else "")
    "where users.key = charts.owner and"
    (conditions.map(->it.0) ++ [
      "(charts.tags && $#tagidx or lower(charts.name) ~ ANY($#tagidx) or lower(charts.description) ~ ANY($#tagidx))" if keyword.length
    ]).filter(->it).join(" and ")
    (if fav => "and likes.type='chart' and likes.uid=charts.key and likes.owner=$#{tagidx + (if keyword.length => 1 else 0)}" else "")
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
    .catch (e) ->
      console.log e.stack
      res.send []

engine.router.api.get "/chart/:id", aux.numid false, (req, res) ->
  io.query([
    'select users.displayname as ownername, charts.*'
    'from users,charts where users.key = owner and'
    "charts.key=$1"
  ].join(" "), [req.params.id])
    .then (it={}) ->
      chart = it.[]rows.0
      if !chart => return aux.r404 res
      if !perm.test(req, chart.{}permission, chart.owner, \read) => return aux.r403 res, "forbidden"
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => delete chart.permission
      return res.json chart
    .catch ->
      console.error it.stack
      return aux.r403 res

engine.router.api.post "/chart/", (req, res) ->
  data = []
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => return aux.r400 res
  if control.size-limit req.user => return aux.r402 res, 'exceed size limit'
  io.query "select count(key) as count from charts where owner = $1", [req.user.key]
    .then (r={}) ->
      # personal item count control
      plan = req.user.{}payment.plan or 0
      count = ((r.[]rows.0 or {}).count or 0)
      if (plan == 0 and count >= 30) or (plan == 1 and count >= 300) =>
        return aux.reject 402, 'exceed count limit'
      data := req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
      ret = charttype.lint data
      if ret.0 => return aux.r400 res, ret
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
    .then (size) -> control.update-size req, req.user, size
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
      ret = charttype.lint(data)
      if ret.0 => return aux.reject 400, ret
      data := charttype.clean data
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
  io.query(
    [
      "select charts.*,users.displayname as ownername"
      "from charts,users where charts.key = $1 and charts.owner=users.key"
    ].join(" "),
    [req.params.id]
  )
    .then (r = {}) ->
      chart = r.[]rows.0
      if !chart => return aux.r404 res, "", true
      if !perm.test(req, chart.{}permission, chart.owner, \read) => return aux.r403 res, "forbidden", true
      permtype = perm.caltype req, chart.{}permission, chart.owner
      if !perm.test(req, chart.{}permission, chart.owner, \admin) => delete chart.permission
      res.render 'view/chart/index.jade', {chart,permtype}, (err, html) ->
        # size
        # console.log html.length
        res.send html
      return null
    .catch ->
      console.error it.stack
      return aux.r403 res, "no luck.", true

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
  [chart,theme] = [null,null]
  io.query([
    'select users.displayname as ownername, users.payment as payment, charts.* from users,charts'
    'where users.key = owner and charts.key=$1'
  ].join(" "), [req.params.id])
    .then (it={}) ->
      chart := it.[]rows.0
      token = req.query.token or null
      if !chart => return bluebird.reject new Error(404)
      if (chart.{}permission.switch != \publish)
      and (!req.user or chart.owner != req.user.key)
      and (!token or chart.{}permission.list.filter(->
        it.type==\token and it.target == token and perm.type.indexOf(it.perm) >= perm.type.indexOf(\read)
      ).length == 0)
        => return bluebird.reject new Error(403)
      delete chart.permission
      chart.plan = chart.{}payment.plan or 0
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
    .catch ->
      if it.message == \404 => return res.render 'view/chart/404.jade'
      if it.message == \403 => return res.render 'view/chart/403.jade'
      console.error it.stack
      return aux.r403 res
