require! <[fs bluebird]>
require! <[../engine/aux ../engine/share/model/ ./thumb ./perm]>
(engine,io) <- (->module.exports = it)  _

stripe = require(\stripe) engine.config.stripe.secret


engine.router.api.post \/test, (req, res) ->
  token = req.body.stripeToken
  if !req.user or !req.user.key => return aux.r403 res
  if !token => return aux.r400 res
  stripe.customers.create {
    source: token, plan: "pro plan", email: req.user
  }, (err, customer) -> console.log err, customer

