require! <[fs bluebird]>
require! <[../../engine/aux ../../engine/share/model/]>
require! <[./tappay]>
(engine,io) <- (->module.exports = it)  _

tappay engine, io

# ---------------
#
engine.router.api.post \/plan/change, (req, res) ->
engine.router.api.post \/pay/change, (req, res) ->

engine.app.get \/me/billing/, (req, res) ->
  if !req.user => return aux.r403 res, "", true
  payload = {}
  payload <<< {} <<< req.user.{}payment{plan, period, expiredate}
  io.query "select * from paymenthistory where owner = $1", [req.user.key]
    .then (r={}) ->
      payload.history = r.[]rows
      res.render \view/me/billing.jade, payload
  /*
  get-customer req, req.user, null
    .then (customer) ->
      subscription = (customer and customer.{}subscriptions.[]data[0]) or {}
      data = (customer and customer.{}sources.[]data[0]) or {}
      ccn = (if data.last4 => "xxxx-xxxx-xxxx-#{data.last4}" else "N/A")
      payload <<< {
        ccn: ccn
        amount: (if subscription => (subscription.{}plan.amount or 0) else 0)/100
      } <<< req.user.payment{plan, period, expiredate}
      io.query "select * from paymenthistory where owner = $1", [req.user.key]
    .then (r={}) ->
      payload.history = r.[]rows
      res.render \view/me/billing.jade, payload
  */
