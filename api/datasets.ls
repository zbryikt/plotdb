require! <[../engine/aux ../engine/share/model/ bluebird ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

control := control engine, io
datasettype = model.type.dataset
datafieldtype = model.type.datafield

engine.router.api.get "/dataset/me/count", (req, res) ->
  if !req.user or !req.user.key => return aux.r404 res
  io.query "select count(key) from datasets where owner = $1", [req.user.key]
    .then (r={})-> res.send (r.[]rows.0 or {count:0}).count
    .catch aux.error-handler res

engine.router.api.get "/dataset/", (req, res) ->
  user = (req.user or {})
  keyword = (req.query.keyword or "")
  offset = req.query.offset or 0
  userkey = parseInt(req.query.owner)
  limit = (req.query.limit or 20) <? 100
  params = [offset, limit, user.key]
  count = -> params.length + 1
  if !req.query.owner =>
    condition = "(datasets.searchable=true or datasets.owner=$#{count!})"
    params.push(user.key or 0)
  else
    if userkey == user.key => condition = "datasets.owner=$#{count!}"
    else condition = "(datasets.owner=$#{count!} and (datasets.searchable=true or datasets.owner=$#{count!})"
    params.push parseInt(req.query.owner or (user.key or 0))
    if userkey != req.user.key => params.push (user.key or 0)
  if keyword =>
    condition += " and datasets.name ~* $#{count!}"
    params.push keyword
  io.query([
    "select datasets.*,users.displayname as ownername from datasets,users"
    "where datasets.owner=users.key and #condition"
    "order by case owner when $3 then 1 else datasets.key end"
    "offset $1 limit $2"
  ].join(" "), params)
    .then -> res.send it.rows
    .catch aux.error-handler res

get-dataset = (req,simple=false) ->
  if !/^\d+$/.exec(req.params.id) => return aux.reject 400
  (resolve, rej) <- new bluebird _
  io.query "select * from datasets where datasets.key = $1", [req.params.id]
    .then (r = {}) ->
      dataset = r.[]rows.0
      if !dataset => return aux.reject 404
      if dataset.{}permission.switch != \publish and
      !perm.test(req, dataset.{}permission, dataset.owner, \read) => return aux.reject 403
      if simple => return resolve dataset
      io.query "select * from datafields where datafields.dataset = $1 order by key", [dataset.key]
        .then (r = {}) ->
          dataset.fields = r.[]rows
          resolve dataset
        .catch -> rej it
    .catch -> rej it

engine.app.get "/dataset/:id", aux.numid true, (req, res) ->
  get-dataset req, true
    .then (ret) ->
      permtype = perm.caltype req, ret.{}permission, ret.owner
      if !perm.test(req, ret.{}permission, ret.owner, \admin) => delete ret.permission
      res.render 'dataset/index.jade', {dataset: ret, permtype}
      return null
    .catch aux.error-handler res, true

engine.router.api.get "/dataset/:id", aux.numid false, (req, res) ->
  get-dataset req
    .then (ret) ->
      if !perm.test(req, ret.{}permission, ret.owner, \admin) => delete ret.permission
      res.json ret
    .catch aux.error-handler res

/*
update-size = (req, delta) -> new bluebird (res, rej) ->
  if !req.user => return rej aux.error 403
  io.query "select datasize from users where users.key = $1", [req.user.key or -1]
    .then (r) ->
      user = r.[]rows.0
      if !user => return rej aux.error 400
      datasize = ((user.datasize or 0) + delta) >? 0
      io.query "update users set datasize = $1 where users.key=$2", [datasize, req.user.key]
        .then ->
          req.login req.user, -> res!
          return null
    .catch ->
      console.error it.stack
      rej it
*/
#TODO remove length check for dynamic dataset
save-dataset = (req, res, okey = null) ->
  if okey and !/^\d+$/.exec("#okey") => return aux.r400 res
  if !req.user => return aux.reject 403
  if !okey and control.size-limit(req.user) => return aux.reject 402, 'exceed size limit'
  # personal item count control
  io.query "select count(key) as count from datasets where owner = $1", [req.user.key]
    .then (r={}) ->
      plan = req.user.{}payment.plan or 0
      count = ((r.[]rows.0 or {}).count or 0)
      if (plan == 0 and count >= 30) or (plan == 1 and count >= 300) =>
        return aux.reject 402, 'exceed count limit'
  if typeof(req.body) != \object => return aux.r400 res
  data = req.body <<< {owner: req.user.key, modifiedtime: new Date!}
  if Array.isArray(data.{}permission.switch) => data.{}permission.switch = \publish
  if !okey => data <<< {createdtime: new Date!}
  cur = null
  fields = null
  promise = (if okey => io.query("select * from datasets where datasets.key = $1", [okey]) else bluebird.resolve(1))
  promise
    .then (r) ->
      if r != 1 =>
        cur := r.[]rows.0
        if !cur => return aux.r404 res
        if !perm.test(req, cur.{}permission, cur.owner, \write) => return aux.reject 403
      else cur := null
      data.size = JSON.stringify(req.body).length
      fields := data.fields or []
      delete data.fields
      if data.type == \static and data.format == \csv =>
        if !Array.isArray(fields) or fields.length == 0 => return aux.reject 400
        if fields.length >= 40 => return aux.reject 403, "field limit exceed"
      ret = datasettype.lint data
      if ret.0 => return aux.reject 400, ret.1
      data := datasettype.clean data
      if !cur => data.owner = req.user.key
      fields := fields.map (field) ->
        if !field or typeof(field) != \object => return aux.reject 400
        datafieldtype.lint field
        return datafieldtype.clean field
      data.fields = fields.map -> it{name, datatype}
      pairs = io.aux.insert.format datasettype, data
      delete pairs.key
      if cur => # dataset exists. don't overwrite owner, and only admin can change permission
        delete pairs.owner
        if !perm.test(req, cur.{}permission, cur.owner, \admin) => delete pairs.permission
      pairs = io.aux.insert.assemble pairs
      (if cur =>
        io.query(
          "update datasets set #{pairs.0} = #{pairs.1} where datasets.key = $#{pairs.2.length + 1}"
          pairs.2 ++ [okey]
        )
      else
        io.query(
          "insert into datasets #{pairs.0} values #{pairs.1} returning key"
          pairs.2
        )
      )

    .then (r={}) ->
      key = if cur => cur.key else r.[]rows.0.key
      data.key = key
      if !fields.length => return res.send data
      io.query("select key,name from datafields where datafields.dataset = $1", [data.key])
        .then (r)->
          ofields = r.[]rows
          pairslist = fields.map ->
            it.dataset = key
            pairs = io.aux.insert.format datafieldtype, it
            matched = ofields.filter(->it.name == pairs.name).0
            if matched =>
              pairs.key = matched.key
              matched.matched = true
            else delete pairs.key
            pairs = [pairs.key, io.aux.insert.assemble(pairs)]
          upcol = pairslist.0.1.0
          insert = pairslist.filter(->!(it.0?))
          size = if insert.length => insert.0.1.2.length else 0
          inscol = if insert.length => insert.0.1.0 else ""
          params = insert.map(-> it.1.2).reduce(((a,b) -> a.concat(b)),[])
          placeholder = (for j from 0 til insert.length =>
            "(" + ["$#{i + j * size}" for i from 1 to size].join(",") + ")"
          ).join(",")
          update = pairslist.filter(->it.0?)
          promises = []
          if insert.length =>
            promises.push(io.query "insert into datafields #inscol values #placeholder", params)
          promises ++= (for item in update => io.query(
            "update datafields set #{item.1.0} = #{item.1.1} where datafields.key = $#{item.1.2.length + 1}"
            item.1.2 ++ [item.0]))
          promises ++= (for item in ofields.filter(->!it.matched) =>
            io.query(
              "delete from datafields where datafields.key = $1", [item.key]
            )
          )
          return bluebird.all(promises)
        .then (r = {}) ->
          control.update-size req, data.owner, data.size - (if cur => cur.size else 0)
        .then -> res.send data
        /*
        # only send keys to save bandwidth
        data.fields = r.[]rows
        req.user.datasize = (req.user.datasize or 0) + data.size
        return io.query "select datasize from users where users.key = $1", [req.user.key]
        .then (r) ->
        user = r.[]rows.0
        if !user =>
          console.error "[post dataset: update user failed]"
          return res.send data
        datasize = (user.datasize or 0) + data.size
        if cur => datasize -= cur.size
        io.query "update users set datasize = $1 where users.key=$2", [datasize, req.user.key]
          .then ->
            req.login req.user, -> res.send data
            return null
        */

    .catch aux.error-handler res

engine.router.api.post "/dataset/", (req, res) ->
  save-dataset req, res

engine.router.api.put "/dataset/:id", aux.numid false, (req, res) ->
  save-dataset req, res, req.params.id

engine.router.api.delete "/dataset/:id", aux.numid false, (req, res) ->
  if !req.user => return aux.r403 res
  io.query "select key,owner,size from datasets where key = $1", [req.params.id]
    .then (r) ->
      dataset = r.[]rows.0
      if !dataset => return aux.reject 404
      if !perm.test(req, dataset.{}permission, dataset.owner, \admin) => return aux.reject 403
      control.update-size req, dataset.owner, -( dataset.size or 0)
      bluebird.all [
        io.query "delete from datafields where dataset = $1", [req.params.id]
        io.query "delete from datasets where key = $1", [req.params.id]
      ] .then -> res.send!
    .catch aux.error-handler res
