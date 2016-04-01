require! <[../engine/aux ../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

datasettype = model.type.dataset
datafieldtype = model.type.datafield

engine.router.api.get "/dataset/", (req, res) -> res.json []
engine.router.api.get "/dataset/:id", (req, res) ->
  io.query "select * from datasets where datasets.key = $1 limit 1", [req.params.id]
    .then (r = {}) ->
      dataset = r.[]rows.0
      if !dataset => return aux.r404 res
      if ((!req.user or req.user.key != dataset.key) and dataset.{}permission.[]switch.indexOf(\public) < 0) =>
        return aux.r403 res
      io.query "select * from datafields where datafields.dataset = $1", [dataset.key]
        .then (r = {}) ->
          dataset.fields = r.[]rows
          res.json dataset
        .catch -> aux.r403 res
    .catch -> aux.r403 res

#TODO remove length check for dynamic dataset
engine.router.api.post "/dataset/", (req, res) ->
  if !req.user => return aux.r403 res
  if typeof(req.body) != \object => aux.r400 res
  data = req.body <<< {owner: req.user.key, createdtime: new Date!, modifiedtime: new Date!}
  fields = data.fields or []
  delete data.fields
  if data.type == \static and data.format == \csv =>
    if !Array.isArray(fields) or fields.length == 0 => return aux.r400 res, [true,"field format incorrect"]
    #TODO enforce in frontend
    if fields.length > 20 => return aux.r400 res, [true, "field limit exceed"]
  ret = datasettype.lint data
  if ret.0 => return aux.r400 res, ret
  fields = fields.map (field) ->
    if !field or typeof(field) != \object => return aux.r400 res, [true,"field format incorrect"]
    datafieldtype.lint field
    return datafieldtype.clean field
  data = datasettype.clean data
  pairs = io.aux.insert.format datasettype, data
  delete pairs.key
  pairs = io.aux.insert.assemble pairs
  io.query "insert into datasets #{pairs.0} values #{pairs.1} returning key", pairs.2
    .then (r={}) ->
      key = r.[]rows.0.key
      data.key = key
      if fields.length =>
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
            res.send data
          .catch ->
            console.error it.stack
            aux.r403 res
      else => res.send data
    .catch ->
      console.error it.stack
      aux.r403 res

engine.router.api.put "/dataset/:id", (req, res) ->
  if !req.user or !req.params.id => aux.r403 res
engine.router.api.delete "/dataset/:id", (req, res) ->
  if !req.user or !req.params.id => aux.r403 res
  io.query "delete from datasets where key = $1",
