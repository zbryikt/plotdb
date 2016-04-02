require! <[../engine/aux ../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

datasettype = model.type.dataset
datafieldtype = model.type.datafield

engine.router.api.get "/dataset/", (req, res) ->
  #TODO consider general dataset api 
  if !req.user => return res.json []
  io.query "select * from datasets where datasets.owner = $1", [req.user.key]
    .then (r = {}) -> return res.json r.[]rows
    .catch ->
      console.log it.stack
      return aux.r403 res

get-dataset =(req) -> new Promise (res, rej) ->
  io.query "select * from datasets where datasets.key = $1", [req.params.id]
    .then (r = {}) ->
      dataset = r.[]rows.0
      if !dataset => return rej 404
      if ((!req.user or req.user.key != dataset.owner) and dataset.{}permission.[]switch.indexOf(\public) < 0) =>
        return rej 403
      io.query "select * from datafields where datafields.dataset = $1", [dataset.key]
        .then (r = {}) ->
          dataset.fields = r.[]rows
          res dataset
        .catch -> 
          console.error it.stack
          return rej 403
    .catch -> 
      console.error it.stack
      return rej 403

engine.app.get "/dataset/:id", (req, res) ->
  get-dataset req
    .then (ret) -> res.render 'dataset/index.jade', {dataset:ret}
    .catch (v) ->
      if v == 404 => return aux.r403 res, "", true
      aux.r403 res, "", true

engine.router.api.get "/dataset/:id", (req, res) ->
  get-dataset req
    .then (ret) -> res.json ret
    .catch (v) ->
      if v == 404 => return aux.r404 res
      aux.r403 res

#TODO remove length check for dynamic dataset
engine.router.api.post "/dataset/", (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  data.size = JSON.stringify(req.body).length
  fields = data.fields or []
  delete data.fields
  if data.type == \static and data.format == \csv =>
    if !Array.isArray(fields) or fields.length == 0 => return aux.r400 res, [true,"field format incorrect"]
    if fields.length > 20 => return aux.r400 res, [true, "field limit exceed"]
  ret = datasettype.lint data
  if ret.0 => return aux.r400 res, ret
  fields = fields.map (field) ->
    if !field or typeof(field) != \object => return aux.r400 res, [true,"field format incorrect"]
    datafieldtype.lint field
    return datafieldtype.clean field
  data = datasettype.clean data
  data.fields = fields.map -> it{name, datatype}
  pairs = io.aux.insert.format datasettype, data
  delete pairs.key
  pairs = io.aux.insert.assemble pairs
  io.query "insert into datasets #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      if !fields.length => return res.send data
      pairslist = fields.map ->
        it.dataset = key
        pairs = io.aux.insert.format datafieldtype, it
        delete pairs.key
        pairs = io.aux.insert.assemble pairs
      columns = pairslist.0.0
      size = pairslist.0.2.length
      params = pairslist.map(-> it.2).reduce(((a,b) -> a.concat(b)),[])
      placeholder = (for j from 0 til pairslist.length =>
        "(" + ["$#{i + j * size}" for i from 1 to size].join(",") + ")"
      ).join(",")
      io.query "insert into datafields #columns values #placeholder", params
        .then (r = {}) ->
          # only send keys to save bandwidth
          data.fields = r.[]rows
          req.user.datasize = (req.user.datasize or 0) + data.size
          return io.query "select datasize from users where key=$1", [req.user.key]
        .then (r) ->
          user = r.[]rows.0
          if !user => 
            console.error "[post dataset: update user failed]"
            return res.send data
          datasize = (user.datasize or 0) + data.size
          io.query "update users set datasize=$1 where key=$2", [datasize, req.user.key]
            .then ->
              req.login req.user, -> res.send data
        .catch ->
          console.error it.stack
          aux.r403 res
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/dataset/:id", (req, res) ->
  if !req.user or !req.params.id => aux.r403 res

engine.router.api.delete "/dataset/:id", (req, res) ->
  if !req.user or !req.params.id => aux.r403 res
  io.query "select key,owner from datasets where key = $1", [req.params.id]
    .then (r) ->
      dataset = r.[]rows.0
      if !dataset or dataset.owner != req.user.key => return aux.r403 res
      Promise.all [
        io.query "delete from datafields where dataset = $1", [req.params.id]
        io.query "delete from datasets where key = $1", [req.params.id]
      ] .then -> res.send!
    .catch ->
      console.error it.stack
      aux.r403 res
