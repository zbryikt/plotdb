require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb ./perm ./control]>
(engine,io) <- (->module.exports = it)  _

engine.router.api.post "/pay/", (req, res) ->
