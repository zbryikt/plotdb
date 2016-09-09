require! <[fs bluebird]>
require! <[../../engine/aux ../../engine/share/model/ ../perm]>
(engine,router,io) <- (->module.exports = it)  _

#TODO limit size
router.put \/chart/:id/local, aux.numid false, (req, res) ->
  id = parseInt(req.params.id)
  data = req.body
  if req.headers["content-length"] > 1000000 => return aux.r413 res
  io.query "select local,permission from charts where key = $1", [id]
    .then (r = {}) ->
      chart = r.rows.0
      if !chart => return bluebird.reject new Error(404)
      if !perm.test(req, chart.{}permission, chart.owner, \comment) => return aux.r403 res
      modifiedtime = new Date!toUTCString!
      io.query(
        "update charts set (local,modifiedtime) = ($2,$3) where key = $1"
        [id, JSON.stringify(data), modifiedtime]
      )
    .then -> res.send!
    .catch aux.error-handler res
