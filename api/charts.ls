require! <[../engine/aux ../engine/share/model/]>
(engine,io) <- (->module.exports = it)  _

themetype = model.type.chart

engine.router.api.get "/chart/", (req, res) -> return res.json []
