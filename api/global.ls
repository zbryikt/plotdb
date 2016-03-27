require! <[../engine/aux]>

(engine) <- (->module.exports = it)  _
engine.app.get \/global, aux.type.json, (req, res) -> res.render \global.ls, {user: req.user, global: true}
