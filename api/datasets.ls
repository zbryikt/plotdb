require! <[../engine/aux ../engine/share/model/ bluebird]>
(engine,io) <- (->module.exports = it)  _

datasettype = model.type.dataset
datafieldtype = model.type.datafield

engine.router.api.get "/dataset/", (req, res) ->
  keyword = (req.query.keyword or "")
  offset = req.query.offset or 0
  userkey = parseInt(req.query.owner)
  limit = (req.query.limit or 20) <? 100
  params = [offset, limit, (req.user or {}).key]
  count = -> params.length + 1
  if !req.query.owner =>
    condition = "(datasets.searchable=true or datasets.owner=$#{count!})"
    params.push ((req.user or {}).key or 0)
  else
    if userkey == req.user.key => condition = "datasets.owner=$#{count!}"
    else condition = "(datasets.owner=$#{count!} and (datasets.searchable=true or datasets.owner=$#{count!})"
    params.push parseInt(req.query.owner or ((req.user or {}).key or 0))
    if userkey != req.user.key => params.push ((req.user or {}).key or 0)
  if keyword =>
    condition += " and datasets.name ~ $#{count!}"
    params.push keyword
  io.query([
    "select datasets.*,users.displayname as ownername from datasets,users"
    "where datasets.owner=users.key and #condition"
    "order by case owner when $3 then 1 else datasets.key end"
    "offset $1 limit $2"
  ].join(" "), params)
    .then ->
      res.send it.rows
    .catch (e) ->
      console.log e.stack
      return aux.r403 res

get-dataset = (req,simple=false) ->
  if !/^\d+$/.exec(req.params.id) => return bluebird.reject new Error("incorrect key type")
  (res, rej) <- new bluebird _
  io.query "select * from datasets where datasets.key = $1", [req.params.id]
    .then (r = {}) ->
      dataset = r.[]rows.0
      if !dataset => return rej new Error! <<< status: 404
      if ((!req.user or req.user.key != dataset.owner) and dataset.{}permission.[]switch.indexOf(\public) < 0) =>
        return rej new Error! <<< status: 403
      if simple => return res dataset
      io.query "select * from datafields where datafields.dataset = $1", [dataset.key]
        .then (r = {}) ->
          dataset.fields = r.[]rows
          res dataset
        .catch ->
          console.error it.stack
          return rej new Error! <<< status: 403
    .catch ->
      console.error it.stack
      return rej new Error! <<< status: 403

engine.app.get "/dataset/:id", aux.numid true, (req, res) ->
  get-dataset req, true
    .then (ret) ->
      res.render 'dataset/index.jade', {dataset:ret}
      return null
    .catch (e) ->
      if e.status == 404 => return aux.r404 res, "", true
      aux.r403 res, "", true

engine.router.api.get "/dataset/:id", aux.numid false, (req, res) ->
  get-dataset req
    .then (ret) -> res.json ret
    .catch (e) ->
      if e.status == 404 => return aux.r404 res
      aux.r403 res

update-size = (req, delta) -> new bluebird (res, rej) ->
  io.query "select datasize from users where users.key = $1", [req.user.key]
    .then (r) ->
      user = r.[]rows.0
      if !user =>
        console.error "[post dataset: update user failed]"
        return res!
      datasize = ((user.datasize or 0) + delta) >? 0
      io.query "update users set datasize = $1 where users.key=$2", [datasize, req.user.key]
        .then -> req.login req.user, -> res!
    .catch ->
      console.error it.stack
      rej it


#TODO remove length check for dynamic dataset
save-dataset = (req, res, okey = null) ->
  if okey and !/^\d+$/.exec("#okey") => return bluebird.reject new Error("incorrect key type")
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => aux.r400 res
  data = req.body <<< {owner: req.user.key, modifiedtime: new Date!}
  if !okey => data <<< {createdtime: new Date!}
  promise = (if okey => io.query("select * from datasets where datasets.key = $1", [okey]) else bluebird.resolve(1))
  promise.then (r) ->
    if r != 1 =>
      cur = r.[]rows.0
      if !cur => return aux.r404 res
      if cur.owner != req.user.key => return aux.r403 res
    else cur = null
    data.size = JSON.stringify(req.body).length
    fields = data.fields or []
    delete data.fields
    if data.type == \static and data.format == \csv =>
      if !Array.isArray(fields) or fields.length == 0 => return aux.r400 res, [true,"field format incorrect"]
      if fields.length >= 40 => return aux.r400 res, [true, "field limit exceed"]
    ret = datasettype.lint data
    if ret.0 => return aux.r400 res, ret
    data := datasettype.clean data
    fields = fields.map (field) ->
      if !field or typeof(field) != \object => return aux.r400 res, [true,"field format incorrect"]
      datafieldtype.lint field
      return datafieldtype.clean field
    data.fields = fields.map -> it{name, datatype}
    pairs = io.aux.insert.format datasettype, data
    delete pairs.key
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
            update-size req, data.size - (if cur => cur.size else 0)
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
          .catch ->
            console.error it.stack
            aux.r403 res
      .catch ->
        console.error it.stack
        aux.r403 res
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.post "/dataset/", (req, res) ->
  save-dataset req, res

engine.router.api.put "/dataset/:id", aux.numid false, (req, res) ->
  save-dataset req, res, req.params.id

engine.router.api.delete "/dataset/:id", aux.numid false, (req, res) ->
  if !req.user => aux.r403 res
  io.query "select key,owner from datasets where key = $1", [req.params.id]
    .then (r) ->
      dataset = r.[]rows.0
      if !dataset or dataset.owner != req.user.key => return aux.r403 res
      update-size req, -dataset.size
      bluebird.all [
        io.query "delete from datafields where dataset = $1", [req.params.id]
        io.query "delete from datasets where key = $1", [req.params.id]
      ] .then -> res.send!
    .catch ->
      console.error it.stack
      aux.r403 res
