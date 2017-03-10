require! <[fs bluebird]>
require! <[../../engine/aux ../../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

engine.router.api.post "/pay/", (req, res) ->
